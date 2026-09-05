import { computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FlowioApiService } from '../../services/flowio-api.service';
import type { PoolStatus } from '../../models/flowio.models';

export class PoolStatusStore {
  private readonly api = inject(FlowioApiService);

  private readonly statusSignal: WritableSignal<PoolStatus | null> = signal(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal: WritableSignal<string | null> = signal(null);

  readonly status: Signal<PoolStatus | null> = computed(() => this.statusSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  readonly filtrationOn = computed(() => this.statusSignal()?.filtrationOn ?? false);
  readonly chlorineOn = computed(() => this.statusSignal()?.chlorineDosingOn ?? false);
  readonly phOn = computed(() => this.statusSignal()?.phDosingOn ?? false);

  load(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getPoolStatus().subscribe({
      next: (s) => {
        this.statusSignal.set(s);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message ?? 'Erreur de chargement');
        this.loadingSignal.set(false);
      }
    });
  }

  toggleFiltration(): void {
    const current = this.statusSignal();
    if (!current) return;
    this.api.setFiltration(!current.filtrationOn).subscribe(() => this.load());
  }

  toggleChlorine(): void {
    const current = this.statusSignal();
    if (!current) return;
    this.api.setChlorineDosing(!current.chlorineDosingOn).subscribe(() => this.load());
  }

  togglePh(): void {
    const current = this.statusSignal();
    if (!current) return;
    this.api.setPhDosing(!current.phDosingOn).subscribe(() => this.load());
  }
}
