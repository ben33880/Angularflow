import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FlowioApiService } from '../../services/flowio-api.service';
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

  private readonly logsSignal = signal<LogEntry[]>([]);
  readonly logs = computed(() => this.logsSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getLogs().subscribe({
      next: (l) => {
        this.logsSignal.set(l);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Erreur de chargement');
        this.loading.set(false);
      }
    });
  }

  levelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'level-error';
      case 'WARN': return 'level-warn';
      default: return 'level-info';
    }
  }
}
