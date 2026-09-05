import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="stat-card text-center">
      <div class="text-sm text-dark-400 mb-2 font-medium">{{ label() }}</div>
      <div class="text-4xl font-bold text-gradient mb-1">
        <ng-content></ng-content>
      </div>
      <div class="text-xs text-dark-500" *ngIf="unit()">{{ unit() }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
}
