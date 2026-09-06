import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
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
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  constructor() {
    effect(() => {
      const log = this.mqtt.logsInfo$();
      if (log) this.addLog(log);
    });
    
    effect(() => {
      const log = this.mqtt.logsWarn$();
      if (log) this.addLog(log);
    });
    
    effect(() => {
      const log = this.mqtt.logsError$();
      if (log) this.addLog(log);
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    setTimeout(() => this.loading.set(false), 1000);
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  private addLog(log: LogEntry): void {
    const current = this.logsSignal();
    this.logsSignal.set([log, ...current].slice(0, 100));
  }

  load(): void {
    this.loading.set(true);
    this.mqtt.connect();
    this.loading.set(false);
  }

  levelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'WARN': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  }
}
