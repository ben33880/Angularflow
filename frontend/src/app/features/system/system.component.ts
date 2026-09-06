import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import type { SystemStatus } from '../../models/flowio.models';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [DecimalPipe, CardComponent],
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly systemSignal = signal<SystemStatus | null>(null);
  readonly system = computed(() => this.systemSignal());
  readonly mqttConnected = this.mqtt.connected;
  readonly loading = signal(true);

  constructor() {
    effect(() => {
      const status = this.mqtt.systemStatus$();
      this.systemSignal.set(status);
      this.loading.set(false);
    });
    
    effect(() => {
      const uptime = this.mqtt.systemUptime$();
      if (uptime && this.systemSignal()) {
        this.systemSignal.update(s => s ? { ...s, uptime: uptime.uptime } : null);
      }
    });
    
    effect(() => {
      const memory = this.mqtt.systemMemory$();
      if (memory && this.systemSignal()) {
        this.systemSignal.update(s => s ? { ...s, freeMemory: memory.free, totalMemory: memory.total } : null);
      }
    });
    
    effect(() => {
      const wifi = this.mqtt.systemWifi$();
      if (wifi && this.systemSignal()) {
        this.systemSignal.update(s => s ? { ...s, wifiRssi: wifi.rssi } : null);
      }
    });
    
    effect(() => {
      const mqtt = this.mqtt.systemMqtt$();
      if (mqtt && this.systemSignal()) {
        this.systemSignal.update(s => s ? { ...s, mqttConnected: mqtt.connected } : null);
      }
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}j ${remainingHours}h`;
    }
    return `${hours}h`;
  }

  formatMemory(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }

  getWifiQuality(rssi: number): string {
    if (rssi >= -50) return 'Excellent';
    if (rssi >= -60) return 'Bon';
    if (rssi >= -70) return 'Moyen';
    if (rssi >= -80) return 'Faible';
    return 'Très faible';
  }

  getWifiClass(rssi: number): string {
    if (rssi >= -50) return 'text-green-400';
    if (rssi >= -60) return 'text-blue-400';
    if (rssi >= -70) return 'text-yellow-400';
    return 'text-red-400';
  }
}
