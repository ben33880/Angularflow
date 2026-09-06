import { computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FlowioApiService } from '../services/flowio-api.service';
import type { DeviceConfig } from '../models/flowio.models';

export class DeviceConfigStore {
  private readonly api = inject(FlowioApiService);

  private readonly configSignal: WritableSignal<DeviceConfig | null> = signal(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal: WritableSignal<string | null> = signal(null);

  readonly config: Signal<DeviceConfig | null> = computed(() => this.configSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getConfig().subscribe({
      next: (c) => {
        this.configSignal.set(c);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message ?? 'Erreur de chargement');
        this.loadingSignal.set(false);
      }
    });
  }

  save(config: DeviceConfig): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.updateConfig(config).subscribe({
      next: () => {
        this.configSignal.set(config);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message ?? 'Erreur de sauvegarde');
        this.loadingSignal.set(false);
      }
    });
  }
}
