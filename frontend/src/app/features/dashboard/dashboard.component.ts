import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { MockMqttService } from '../../services/mock-mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ToastService } from '../../shared/ui/toast.service';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { environment } from '../../../environments/environment';
import type { PoolStatus, PoolChemistry } from '../../models/flowio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgClass, CardComponent, StatCardComponent, ButtonComponent, SkeletonComponent, EmptyStateComponent, BadgeComponent, TemperaturePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly mqttService = inject(MqttService);
  private readonly mockService = inject(MockMqttService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly service = environment.useMockMqtt ? this.mockService : this.mqttService;

  private readonly statusSignal = signal<PoolStatus | null>(null);
  private readonly chemistrySignal = signal<PoolChemistry | null>(null);
  
  readonly status = computed(() => this.statusSignal());
  readonly chemistry = computed(() => this.chemistrySignal());
  
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.service.connected;

  readonly temperature = computed(() => this.statusSignal()?.temperature ?? null);
  readonly ph = computed(() => this.chemistrySignal()?.ph ?? this.statusSignal()?.ph ?? null);
  readonly orp = computed(() => this.chemistrySignal()?.orp ?? this.statusSignal()?.orp ?? null);

  constructor() {
    this.service.poolStatus$.subscribe(status => {
      if (status) {
        this.statusSignal.set(status);
        this.loading.set(false);
      }
    });
    
    this.service.chemistry$.subscribe(chem => {
      if (chem) {
        this.chemistrySignal.set(chem);
        this.checkAlerts();
      }
    });
  }

  ngOnInit(): void {
    this.service.connect();
    this.destroyRef.onDestroy(() => this.service.disconnect());
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
    this.service.setFiltration(newState);
    this.toast.success(newState ? 'Filtration demarree' : 'Filtration arretee');
  }

  toggleChlorine(): void {
    const newState = !this.statusSignal()?.chlorineDosingOn;
    this.service.setChlorine(newState);
    this.toast.success(newState ? 'Chlore active' : 'Chlore desactive');
  }

  togglePh(): void {
    const newState = !this.statusSignal()?.phDosingOn;
    this.service.setPhDosing(newState);
    this.toast.success(newState ? 'pH active' : 'pH desactive');
  }
}
