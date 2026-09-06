import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all"
      [ngClass]="{
        'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300': variant === 'default',
        'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': variant === 'success',
        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': variant === 'warning',
        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': variant === 'error',
        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300': variant === 'info'
      }"
    >
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
}
