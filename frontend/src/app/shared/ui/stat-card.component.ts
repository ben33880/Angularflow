import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="stat-card">
      <div class="text-4xl mb-3 gradient-text">
        <i class="bi bi-activity"></i>
      </div>
      <div class="text-sm text-slate-400 mb-2 font-medium">{{ label() }}</div>
      <div class="text-4xl font-bold text-white leading-none">
        <ng-content></ng-content>
      </div>
      <div class="text-xs text-slate-400 mt-2" *ngIf="unit()">{{ unit() }}</div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
}
