import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="min-h-screen flex">
      <app-nav />
      <main class="flex-1 p-8 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
