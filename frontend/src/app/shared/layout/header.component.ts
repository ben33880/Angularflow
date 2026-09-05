import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <header class="mb-8 animate-slide-up">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">{{ title }}</h1>
          <p class="text-slate-600 dark:text-slate-400">{{ description }}</p>
        </div>
        @if (actions) {
          <div class="flex items-center gap-2">
            <ng-content></ng-content>
          </div>
        }
      </div>
      @if (breadcrumbs && breadcrumbs.length > 0) {
        <nav class="flex items-center gap-2 mt-4 text-sm">
          @for (crumb of breadcrumbs; track crumb.label; let last = $last) {
            @if (last) {
              <span class="text-slate-900 dark:text-white font-medium">{{ crumb.label }}</span>
            } @else {
              <a [href]="crumb.href" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                {{ crumb.label }}
              </a>
              @if (!$last) {
                <span class="text-slate-400">/</span>
              }
            }
          }
        </nav>
      }
    </header>
  `
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() breadcrumbs?: { label: string; href?: string }[];
  @Input() actions: boolean = false;
}
