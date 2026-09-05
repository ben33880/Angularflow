import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FlowioApiService } from '../../services/flowio-api.service';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import type { LogEntry } from '../../models/flowio.models';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CardComponent, ButtonComponent],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsComponent implements OnInit {
  private readonly api = inject(FlowioApiService);
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly logsSignal = signal<LogEntry[]>([]);
  readonly logs = computed(() => this.logsSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  private readonly maxLogs = 100;

  constructor() {
    // Subscribe to MQTT logs streaming
    this.mqtt.logsInfo$.subscribe(log => this.addLog(log));
    this.mqtt.logsWarn$.subscribe(log => this.addLog(log));
    this.mqtt.logsError$.subscribe(log => this.addLog(log));
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
      this.api.getLogs().subscribe({
        next: (l) => {
          this.logsSignal.set(l.slice(-this.maxLogs));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Erreur de chargement');
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }

  private addLog(log: LogEntry): void {
    const current = this.logsSignal();
    const updated = [...current, log].slice(-this.maxLogs);
    this.logsSignal.set(updated);
  }

  levelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'level-error';
      case 'WARN': return 'level-warn';
      default: return 'level-info';
    }
  }

  clear(): void {
    this.logsSignal.set([]);
  }
}
