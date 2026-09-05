import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="stat-card">
      <div class="stat-icon">
        <i class="bi bi-activity"></i>
      </div>
      <div class="stat-label">{{ label() }}</div>
      <div class="stat-value">
        <ng-content></ng-content>
      </div>
      <div class="stat-unit" *ngIf="unit()">{{ unit() }}</div>
    </div>
  `,
  styles: [`
    .stat-icon {
      @apply text-3xl mb-3;
      @apply bg-gradient-primary bg-clip-text;
      -webkit-text-fill-color: transparent;
    }
    .stat-label {
      @apply text-sm text-text-secondary mb-2 font-medium;
    }
    .stat-value {
      @apply text-3xl font-bold text-text-primary leading-none;
    }
    .stat-unit {
      @apply text-xs text-text-secondary mt-2;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
}
