import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { NgIf } from '@angular/common';
import { FlowioApiService } from '../../services/flowio-api.service';
import { WebsocketService } from '../../services/websocket.service';
import { CardComponent } from '../../shared/ui/card.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import type { PoolStatus } from '../../models/flowio.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, CardComponent, StatCardComponent, ButtonComponent, TemperaturePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(FlowioApiService);
  private readonly ws = inject(WebsocketService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly statusSignal = signal<PoolStatus | null>(null);
  readonly status = computed(() => this.statusSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly wsConnected = this.ws.connected;

  readonly temperature = computed(() => this.statusSignal()?.temperature ?? null);
  readonly ph = computed(() => this.statusSignal()?.ph ?? null);
  readonly orp = computed(() => this.statusSignal()?.orp ?? null);

  constructor() {
    // Subscribe to WebSocket messages for real-time updates
    effect(() => {
      if (this.wsConnected()) {
        this.ws.messages$.subscribe({
          next: (msg) => {
            if (msg.type === 'pool_status') {
              this.statusSignal.set(msg.data as PoolStatus);
              this.loading.set(false);
            }
          },
          error: (err) => {
            console.error('WS message error:', err);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.ws.connect();
    this.load();
    this.destroyRef.onDestroy(() => this.ws.disconnect());
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    
    // Try WebSocket first, fallback to HTTP
    if (this.wsConnected()) {
      this.ws.sendMessage('get_pool_status', {});
    } else {
      this.api.getPoolStatus().subscribe({
        next: (s) => {
          this.statusSignal.set(s);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Erreur de chargement');
          this.loading.set(false);
        }
      });
    }
  }

  toggleFiltration(): void {
    const s = this.statusSignal();
    if (!s) return;
    this.api.setFiltration(!s.filtrationOn).subscribe(() => this.load());
  }

  toggleChlorine(): void {
    const s = this.statusSignal();
    if (!s) return;
    this.api.setChlorineDosing(!s.chlorineDosingOn).subscribe(() => this.load());
  }

  togglePh(): void {
    const s = this.statusSignal();
    if (!s) return;
    this.api.setPhDosing(!s.phDosingOn).subscribe(() => this.load());
  }
}
