import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template: `
    <div class="flex min-h-screen">
      <app-nav />
      <main class="flex-1 bg-dark-bg overflow-x-hidden">
        <div class="container-fluid py-4 px-6">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
