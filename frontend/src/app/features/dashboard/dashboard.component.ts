import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ToastService } from '../../shared/ui/toast.service';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import type { PoolStatus, PoolTemperatures, PoolChemistry, SystemStatus } from '../../models/flowio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, CardComponent, StatCardComponent, ButtonComponent, SkeletonComponent, EmptyStateComponent, BadgeComponent, TemperaturePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly statusSignal = signal<PoolStatus | null>(null);
  private readonly temperaturesSignal = signal<PoolTemperatures | null>(null);
  private readonly chemistrySignal = signal<PoolChemistry | null>(null);
  private readonly systemSignal = signal<SystemStatus | null>(null);
  
  readonly status = computed(() => this.statusSignal());
  readonly temperatures = computed(() => this.temperaturesSignal());
  readonly chemistry = computed(() => this.chemistrySignal());
  readonly system = computed(() => this.systemSignal());
  
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  readonly temperature = computed(() => this.statusSignal()?.temperature ?? null);
  readonly ph = computed(() => this.chemistrySignal()?.ph ?? this.statusSignal()?.ph ?? null);
  readonly orp = computed(() => this.chemistrySignal()?.orp ?? this.statusSignal()?.orp ?? null);

  constructor() {
    this.mqtt.poolStatus$.subscribe(status => {
      if (status) {
        this.statusSignal.set(status);
        this.loading.set(false);
      }
    });
    
    this.mqtt.temperatures$.subscribe(temps => {
      if (temps) this.temperaturesSignal.set(temps);
    });
    
    this.mqtt.chemistry$.subscribe(chem => {
      if (chem) {
        this.chemistrySignal.set(chem);
        this.checkAlerts();
      }
    });
    
    this.mqtt.systemStatus$.subscribe(sys => {
      if (sys) this.systemSignal.set(sys);
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
      this.toast.warning(`pH: ${ph} - Hors plage recommandÃ©e (7.0-7.6)`);
    }
    
    if (orp !== null && orp < 650) {
      this.toast.info(`ORP: ${orp} mV - Niveau bas`);
    }
  }

  toggleFiltration(): void {
    const newState = !this.statusSignal()?.filtrationOn;
    this.mqtt.setFiltration(newState);
    this.toast.success(newState ? 'Filtration dÃ©marrÃ©e' : 'Filtration arrÃªtÃ©e');
  }

  toggleChlorine(): void {
    const newState = !this.statusSignal()?.chlorineDosingOn;
    this.mqtt.setChlorine(newState);
    this.toast.success(newState ? 'Chlore activÃ©' : 'Chlore dÃ©sactivÃ©');
  }

  togglePh(): void {
    const newState = !this.statusSignal()?.phDosingOn;
    this.mqtt.setPhDosing(newState);
    this.toast.success(newState ? 'pH activÃ©' : 'pH dÃ©sactivÃ©');
  }
}
