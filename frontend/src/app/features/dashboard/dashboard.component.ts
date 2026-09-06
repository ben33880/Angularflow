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
      this.toast.warning(`pH: ${ph} - Hors plage recommandee (7.0-7.6)`);
    }
    
    if (orp !== null && orp < 650) {
      this.toast.info(`ORP: ${orp} mV - Niveau bas`);
    }
  }

  toggleFiltration(): void {
    const newState = !this.statusSignal()?.filtrationOn;
    this.mqtt.setFiltration(newState);
    this.toast.success(newState ? 'Filtration demarree' : 'Filtration arretee');
  }

  toggleChlorine(): void {
    const newState = !this.statusSignal()?.chlorineDosingOn;
    this.mqtt.setChlorine(newState);
    this.toast.success(newState ? 'Chlore active' : 'Chlore desactive');
  }

  togglePh(): void {
    const newState = !this.statusSignal()?.phDosingOn;
    this.mqtt.setPhDosing(newState);
    this.toast.success(newState ? 'pH active' : 'pH desactive');
  }
}
