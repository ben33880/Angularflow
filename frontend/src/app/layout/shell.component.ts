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
        <div class="content-wrapper">
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
      padding: 32px;
      overflow-y: auto;
    }
    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
