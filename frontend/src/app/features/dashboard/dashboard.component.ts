import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import type { PoolStatus, PoolTemperatures, PoolChemistry, SystemStatus } from '../../models/flowio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, CardComponent, StatCardComponent, ButtonComponent, TemperaturePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly statusSignal = signal<PoolStatus | null>(null);
  private readonly temperaturesSignal = signal<PoolTemperatures | null>(null);
  private readonly chemistrySignal = signal<PoolChemistry | null>(null);
  private readonly systemSignal = signal<SystemStatus | null>(null);
  
  readonly status = computed(() => this.statusSignal());
  readonly temperatures = computed(() => this.temperaturesSignal());
  readonly chemistry = computed(() => this.chemistrySignal());
  readonly system = computed(() => this.systemSignal());
  
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  readonly temperature = computed(() => this.statusSignal()?.temperature ?? null);
  readonly ph = computed(() => this.chemistrySignal()?.ph ?? this.statusSignal()?.ph ?? null);
  readonly orp = computed(() => this.chemistrySignal()?.orp ?? this.statusSignal()?.orp ?? null);

  constructor() {
    // Subscribe to ALL MQTT topics
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
      if (chem) this.chemistrySignal.set(chem);
    });
    
    this.mqtt.systemStatus$.subscribe(sys => {
      if (sys) this.systemSignal.set(sys);
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.loading.set(true);
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  toggleFiltration(): void {
    this.mqtt.setFiltration(!this.statusSignal()?.filtrationOn);
  }

  toggleChlorine(): void {
    this.mqtt.setChlorine(!this.statusSignal()?.chlorineDosingOn);
  }

  togglePh(): void {
    this.mqtt.setPhDosing(!this.statusSignal()?.phDosingOn);
  }
}
