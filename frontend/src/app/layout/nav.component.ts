import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <div class="nav-brand">Flow.io</div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/config" routerLinkActive="active">Config</a>
        <a routerLink="/logs" routerLinkActive="active">Logs</a>
        <a routerLink="/alarms" routerLinkActive="active">Alarmes</a>
      </div>
    </nav>
  `,
  styles: [`
    .nav {
      width: 220px;
      background: #1f2937;
      color: #fff;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .nav-brand {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .nav-links a {
      color: #e5e7eb;
      text-decoration: none;
      padding: 6px 8px;
      border-radius: 6px;
    }
    .nav-links a.active {
      background: #374151;
      color: #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {}
