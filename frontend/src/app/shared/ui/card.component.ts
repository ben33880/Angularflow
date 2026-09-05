import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="flow-card">
      <div class="flow-card-header" *ngIf="title()">
        <h3 class="flow-card-title">{{ title() }}</h3>
      </div>
      <div class="flow-card-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .flow-card-header {
      @apply mb-5;
    }
    .flow-card-title {
      @apply m-0 text-xl font-bold text-text-primary;
    }
    .flow-card-content {
      @apply text-text-primary;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
