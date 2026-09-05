import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out"
        [ngStyle]="{ width: value + '%' }"
      ></div>
    </div>
  `
})
export class ProgressComponent {
  @Input() value: number = 0;
}
