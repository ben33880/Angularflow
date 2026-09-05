import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FlowioApiService } from '../../services/flowio-api.service';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import type { PoolStatus } from '../../models/flowio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, CardComponent, StatCardComponent, ButtonComponent, TemperaturePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(FlowioApiService);
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly statusSignal = signal<PoolStatus | null>(null);
  readonly status = computed(() => this.statusSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  readonly temperature = computed(() => this.statusSignal()?.temperature ?? null);
  readonly ph = computed(() => this.statusSignal()?.ph ?? null);
  readonly orp = computed(() => this.statusSignal()?.orp ?? null);

  constructor() {
    // Subscribe to MQTT pool status for real-time updates
    this.mqtt.poolStatus$.subscribe({
      next: (status: PoolStatus) => {
        this.statusSignal.set(status);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Dashboard] MQTT pool status error:', err);
      }
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.load();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    
    // MQTT will push updates automatically, but we can also fetch via HTTP
    if (!this.mqttConnected()) {
      this.api.getPoolStatus().subscribe({
        next: (s) => {
          this.statusSignal.set(s);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Erreur de chargement');
          this.loading.set(false);
        }
      });
    }
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
