import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="w-72 glass border-r border-dark-700/50 p-6 flex flex-col gap-8">
      <div class="text-3xl font-bold text-gradient tracking-tight">
        🌊 Flow.io
      </div>
      
      <div class="flex flex-col gap-2">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link flex items-center gap-3">
          <span>📊</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/config" routerLinkActive="active" class="nav-link flex items-center gap-3">
          <span>⚙️</span>
          <span>Config</span>
        </a>
        <a routerLink="/logs" routerLinkActive="active" class="nav-link flex items-center gap-3">
          <span>📋</span>
          <span>Logs</span>
        </a>
        <a routerLink="/alarms" routerLinkActive="active" class="nav-link flex items-center gap-3">
          <span>🚨</span>
          <span>Alarmes</span>
        </a>
      </div>
      
      <div class="mt-auto pt-6 border-t border-dark-700/50">
        <div class="text-xs text-dark-400">
          <p>Pool Controller</p>
          <p class="mt-1">v1.0.0</p>
        </div>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {}
