import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="flow-card card-hover">
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
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      padding: 24px;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .flow-card-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f1f5f9;
    }
    .flow-card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
    }
    .flow-card-content {
      color: #475569;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
