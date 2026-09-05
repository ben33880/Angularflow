import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FlowioApiService } from '../../services/flowio-api.service';
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

  private readonly alarmsSignal = signal<AlarmEntry[]>([]);
  readonly alarms = computed(() => this.alarmsSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly unackCount = computed(() =>
    this.alarmsSignal().filter(a => !a.acknowledged).length
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
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
  }

  severityClass(severity: string): string {
    return `severity-${severity.toLowerCase()}`;
  }

  acknowledge(id: string): void {
    this.api.acknowledgeAlarm(id).subscribe(() => this.load());
  }
}
