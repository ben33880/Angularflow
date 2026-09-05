import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="app-shell">
      <app-nav />
      <main class="app-main">
        <div class="container-fluid py-4">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
    }
    .app-main {
      flex: 1;
      background: var(--bg-primary);
      overflow-x: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
