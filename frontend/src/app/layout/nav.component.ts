import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <div class="nav-brand">
        <div class="brand-icon">🏊</div>
        <span class="brand-text">Flow.io</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/config" routerLinkActive="active">
          <span class="nav-icon">⚙️</span>
          <span>Config</span>
        </a>
        <a routerLink="/logs" routerLinkActive="active">
          <span class="nav-icon">📋</span>
          <span>Logs</span>
        </a>
        <a routerLink="/alarms" routerLinkActive="active">
          <span class="nav-icon">🚨</span>
          <span>Alarmes</span>
        </a>
      </div>
      <div class="nav-footer">
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>Connecté·§</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav {
      width: 260px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: #fff;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }
    .brand-icon {
      font-size: 2rem;
    }
    .brand-text {
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.2s;
      font-weight: 500;
    }
    .nav-links a:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      transform: translateX(4px);
    }
    .nav-links a.active {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #fff;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
    }
    .nav-icon {
      font-size: 1.25rem;
    }
    .nav-footer {
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: rgba(34, 197, 94, 0.1);
      border-radius: 8px;
      font-size: 0.875rem;
      color: #4ade80;
      font-weight: 600;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {}
