import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="sidebar-brand">
        <i class="bi bi-water"></i>
        <span>Flow.io</span>
      </div>
      <div class="sidebar-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </a>
        <a routerLink="/config" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-gear"></i>
          <span>Config</span>
        </a>
        <a routerLink="/logs" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-journal-text"></i>
          <span>Logs</span>
        </a>
        <a routerLink="/alarms" routerLinkActive="active" class="sidebar-link">
          <i class="bi bi-exclamation-triangle"></i>
          <span>Alarmes</span>
        </a>
      </div>
      <div class="sidebar-footer">
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>En ligne</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--bg-secondary);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      position: fixed;
      height: 100vh;
      z-index: 100;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .sidebar-brand i {
      font-size: 2rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sidebar-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 0.75rem;
      transition: all 0.2s;
      font-weight: 500;
    }
    .sidebar-link i {
      font-size: 1.25rem;
    }
    .sidebar-link:hover {
      background: rgba(59, 130, 246, 0.1);
      color: var(--text-primary);
    }
    .sidebar-link.active {
      background: var(--gradient-primary);
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    .sidebar-footer {
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {}
