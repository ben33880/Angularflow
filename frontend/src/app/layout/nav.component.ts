import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="w-[260px] bg-dark-secondary border-r border-white/10 flex flex-col p-6 fixed h-screen z-[100]">
      <div class="flex items-center gap-3 text-2xl font-bold text-white mb-8 pb-6 border-b border-white/10">
        <i class="bi bi-water text-4xl gradient-text"></i>
        <span>Flow.io</span>
      </div>
      <div class="flex flex-col gap-2 flex-1">
        <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-speedometer2 text-2xl"></i>
          <span>Dashboard</span>
        </a>
        <a routerLink="/config" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-gear text-2xl"></i>
          <span>Config</span>
        </a>
        <a routerLink="/logs" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-journal-text text-2xl"></i>
          <span>Logs</span>
        </a>
        <a routerLink="/alarms" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-exclamation-triangle text-2xl"></i>
          <span>Alarmes</span>
        </a>
      </div>
      <div class="pt-6 border-t border-white/10">
        <div class="flex items-center gap-2 text-sm text-slate-400 p-3 rounded-lg bg-white/5 transition-all duration-300" [class.bg-emerald-500/10]="wsConnected()" [class.border]="wsConnected()" [class.border-emerald-500/30]="wsConnected()" [class.text-emerald-400]="wsConnected()">
          <span class="status-dot"></span>
          <span>{{ wsConnected() ? 'WebSocket connecté' : 'En ligne (HTTP)' }}</span>
        </div>
      </div>
    </nav>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
  private readonly ws = inject(WebsocketService);
  readonly wsConnected = this.ws.connected;
}
