import { computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FlowioApiService } from '../../services/flowio-api.service';
import type { AlarmEntry } from '../../models/flowio.models';

export class AlarmsStore {
  private readonly api = inject(FlowioApiService);

  private readonly alarmsSignal: WritableSignal<AlarmEntry[]> = signal([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal: WritableSignal<string | null> = signal(null);

  readonly alarms: Signal<AlarmEntry[]> = computed(() => this.alarmsSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  readonly unackCount = computed(() =>
    this.alarmsSignal().filter(a => !a.acknowledged).length
  );

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getAlarms().subscribe({
      next: (a) => {
        this.alarmsSignal.set(a);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message ?? 'Erreur de chargement');
        this.loadingSignal.set(false);
      }
    });
  }

  acknowledge(id: string): void {
    this.api.acknowledgeAlarm(id).subscribe(() => this.load());
  }
}
