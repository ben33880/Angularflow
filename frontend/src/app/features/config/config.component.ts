import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlowioApiService } from '../../services/flowio-api.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import type { DeviceConfig } from '../../models/flowio.models';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [NgIf, FormsModule, CardComponent, ButtonComponent],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent implements OnInit {
  private readonly api = inject(FlowioApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly configSignal = signal<DeviceConfig | null>(null);
  readonly config = computed(() => this.configSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);
    this.api.getConfig().subscribe({
      next: (c) => {
        this.configSignal.set(c);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  save(): void {
    const cfg = this.configSignal();
    if (!cfg) return;
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);
    this.api.updateConfig(cfg).subscribe({
      next: () => {
        this.saved.set(true);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erreur de sauvegarde');
        this.loading.set(false);
      }
    });
  }
}
