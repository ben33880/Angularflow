import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card, flow-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="glass-card p-6 mb-6">
      <div class="mb-5" *ngIf="title()">
        <h3 class="text-xl font-bold text-white m-0">{{ title() }}</h3>
      </div>
      <div class="text-white">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
