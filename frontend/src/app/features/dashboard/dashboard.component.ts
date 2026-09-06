import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { NgClass } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ToastService } from '../../shared/ui/toast.service';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import type { PoolStatus, PoolChemistry } from '../../models/flowio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, CardComponent, StatCardComponent, ButtonComponent, SkeletonComponent, EmptyStateComponent, BadgeComponent, TemperaturePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  
  private readonly statusSignal = signal<PoolStatus | null>(null);
  private readonly chemistrySignal = signal<PoolChemistry | null>(null);
  
  readonly status = computed(() => this.statusSignal());
  readonly chemistry = computed(() => this.chemistrySignal());
  
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  readonly temperature = computed(() => this.statusSignal()?.temperature ?? null);
  readonly ph = computed(() => this.chemistrySignal()?.ph ?? this.statusSignal()?.ph ?? null);
  readonly orp = computed(() => this.chemistrySignal()?.orp ?? this.statusSignal()?.orp ?? null);
  readonly phDisplay = computed(() => {
    const value = this.ph();
    return value === null ? '--' : value.toFixed(2);
  });
  readonly orpDisplay = computed(() => {
    const value = this.orp();
    return value === null ? '--' : `${Math.round(value)} mV`;
  });
  private lastAlertAt = new Map<string, number>();

  constructor() {
    effect(() => {
      const status = this.mqtt.poolStatus$();
      if (status) {
        this.statusSignal.set(status);
        this.loading.set(false);
      }
    });
    
    effect(() => {
      const chem = this.mqtt.chemistry$();
      if (chem) {
        this.chemistrySignal.set(chem);
        this.checkAlerts();
      }
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  private checkAlerts(): void {
    const ph = this.ph();
    const orp = this.orp();
    
    if (ph !== null && (ph < 7.0 || ph > 7.6)) {
      this.notifyOnce('ph', `pH : ${ph.toFixed(2)} - Hors plage recommandée (7.0-7.6)`, 'warning');
    }
    
    if (orp !== null && orp < 650) {
      this.notifyOnce('orp', `ORP : ${Math.round(orp)} mV - Niveau bas`, 'info');
    }
  }

  private notifyOnce(key: string, message: string, type: 'warning' | 'info'): void {
    const now = Date.now();
    const last = this.lastAlertAt.get(key) ?? 0;
    if (now - last < 30000) return;
    this.lastAlertAt.set(key, now);
    type === 'warning' ? this.toast.warning(message) : this.toast.info(message);
  }

  toggleFiltration(): void {
    const newState = !this.statusSignal()?.filtrationOn;
    this.mqtt.setFiltration(newState);
    this.toast.success(newState ? 'Filtration démarrée' : 'Filtration arrêtée');
  }

  toggleChlorine(): void {
    const newState = !this.statusSignal()?.chlorineDosingOn;
    this.mqtt.setChlorine(newState);
    this.toast.success(newState ? 'Chlore activé' : 'Chlore désactivé');
  }

  togglePh(): void {
    const newState = !this.statusSignal()?.phDosingOn;
    this.mqtt.setPhDosing(newState);
    this.toast.success(newState ? 'pH activé' : 'pH désactivé');
  }
}
