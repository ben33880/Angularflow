import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="stat-card">
      <div class="stat-label">{{ label() }}</div>
      <div class="stat-value">
        <ng-content></ng-content>
      </div>
      <div class="stat-unit" *ngIf="unit()">{{ unit() }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      flex: 1;
      min-width: 120px;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }
    .stat-unit {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
}
