import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
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
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly logsSignal = signal<LogEntry[]>([]);
  readonly logs = computed(() => this.logsSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  constructor() {
    // Subscribe to MQTT log topics - REAL TIME
    this.mqtt.logsInfo$.subscribe(log => {
      if (log) this.addLog(log);
    });
    
    this.mqtt.logsWarn$.subscribe(log => {
      if (log) this.addLog(log);
    });
    
    this.mqtt.logsError$.subscribe(log => {
      if (log) this.addLog(log);
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.loading.set(false); // MQTT push logs in real-time
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  private addLog(log: LogEntry): void {
    const current = this.logsSignal();
    this.logsSignal.set([log, ...current].slice(0, 100)); // Keep last 100 logs
  }

  levelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'level-error';
      case 'WARN': return 'level-warn';
      default: return 'level-info';
    }
  }
}
