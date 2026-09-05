import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FlowioApiService } from '../../services/flowio-api.service';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import type { AlarmEntry } from '../../models/flowio.models';

@Component({
  selector: 'app-alarms',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CardComponent, ButtonComponent],
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmsComponent implements OnInit {
  private readonly api = inject(FlowioApiService);
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly alarmsSignal = signal<AlarmEntry[]>([]);
  readonly alarms = computed(() => this.alarmsSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  constructor() {
    // Subscribe to MQTT alarm topics
    this.mqtt.alarmsActive$.subscribe(alarms => {
      this.alarmsSignal.set(alarms);
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
    
    if (!this.mqttConnected()) {
      this.api.getAlarms().subscribe({
        next: (a) => {
          this.alarmsSignal.set(a);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Erreur de chargement');
          this.loading.set(false);
        }
      });
    } else {
      // MQTT will push alarms in real-time
      this.loading.set(false);
    }
  }

  severityClass(severity: string): string {
    return `severity-${severity.toLowerCase()}`;
  }

  acknowledge(id: string): void {
    this.mqtt.acknowledgeAlarm(id);
  }
}
