import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="card animate-on-hover">
      <div class="mb-4" *ngIf="title()">
        <h3 class="text-xl font-bold text-gradient">{{ title() }}</h3>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
