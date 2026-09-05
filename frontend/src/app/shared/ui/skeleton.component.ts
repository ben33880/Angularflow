import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass],
  template: `
    <div 
      class="animate-pulse bg-slate-200 dark:bg-slate-700 rounded"
      [ngClass]="classes"
    ></div>
  `
})
export class SkeletonComponent {
  @Input() width: string = 'w-full';
  @Input() height: string = 'h-4';
  @Input() rounded: string = 'rounded';
  
  get classes(): string {
    return `${this.width} ${this.height} ${this.rounded}`;
  }
}
