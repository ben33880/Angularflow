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
        <router-outlet />
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
      padding: 24px;
      background: #f3f4f6;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
