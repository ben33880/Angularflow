import { computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FlowioApiService } from '../services/flowio-api.service';
import type { LogEntry } from '../models/flowio.models';

export class LogsStore {
  private readonly api = inject(FlowioApiService);

  private readonly logsSignal: WritableSignal<LogEntry[]> = signal([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal: WritableSignal<string | null> = signal(null);

  readonly logs: Signal<LogEntry[]> = computed(() => this.logsSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getLogs().subscribe({
      next: (l) => {
        this.logsSignal.set(l);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message ?? 'Erreur de chargement');
        this.loadingSignal.set(false);
      }
    });
  }

  refresh(): void {
    this.load();
  }
}
