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
    .flow-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 16px;
      margin-bottom: 16px;
    }
    .flow-card-header {
      margin-bottom: 12px;
    }
    .flow-card-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
    }
    .flow-card-content {
      color: #374151;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
