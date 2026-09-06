import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
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
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly alarmsSignal = signal<AlarmEntry[]>([]);
  readonly alarms = computed(() => this.alarmsSignal());
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly mqttConnected = this.mqtt.connected;

  constructor() {
    effect(() => {
      const alarms = this.mqtt.alarmsActive$();
      this.alarmsSignal.set(alarms);
      this.loading.set(false);
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  severityClass(severity: string): string {
    const map: Record<string, string> = {
      'LOW': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'MEDIUM': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'HIGH': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      'CRITICAL': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return map[severity] || map['LOW'];
  }

  acknowledge(id: string): void {
    this.mqtt.acknowledgeAlarm(id);
  }

  load(): void {
    this.loading.set(true);
    this.mqtt.connect();
  }

  readonly unackCount = computed(() => this.alarmsSignal().filter(alarm => !alarm.acknowledged).length);
}
