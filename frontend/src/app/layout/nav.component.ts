import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <div class="nav-brand">
        <div class="brand-icon">◈</div>
        <span>Flow.io</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">
          <span class="icon">◧</span>
          Dashboard
        </a>
        <a routerLink="/config" routerLinkActive="active">
          <span class="icon">⚙</span>
          Config
        </a>
        <a routerLink="/logs" routerLinkActive="active">
          <span class="icon">📋</span>
          Logs
        </a>
        <a routerLink="/alarms" routerLinkActive="active">
          <span class="icon">⚠</span>
          Alarmes
        </a>
      </div>
      <div class="nav-footer">
        <div class="status-indicator"></div>
        <span class="status-text">Connecté·ª</span>
      </div>
    </nav>
  `,
  styles: [`
    .nav {
      width: 260px;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      border-right: 1px solid var(--border);
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: fixed;
      height: 100vh;
      overflow: hidden;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--accent-gradient);
      border-radius: var(--radius);
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      box-shadow: var(--shadow-lg);
    }
    .brand-icon {
      font-size: 1.5rem;
      animation: pulse 2s infinite;
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
      padding: 12px 16px;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-sm);
      transition: var(--transition);
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }
    .nav-links a::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background: var(--accent-gradient);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }
    .nav-links a:hover {
      background: rgba(59, 130, 246, 0.1);
      color: var(--text-primary);
      transform: translateX(4px);
    }
    .nav-links a:hover::before {
      transform: scaleY(1);
    }
    .nav-links a.active {
      background: rgba(59, 130, 246, 0.15);
      color: var(--text-primary);
      border-left: 3px solid var(--accent-primary);
    }
    .nav-links a.active::before {
      transform: scaleY(1);
    }
    .icon {
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }
    .nav-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      color: var(--success);
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    .status-text {
      font-weight: 500;
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.1);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {}
