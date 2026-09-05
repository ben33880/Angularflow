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
      background: var(--bg-card);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: var(--shadow-lg);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .flow-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
    }
    .flow-card-header {
      margin-bottom: 1.25rem;
    }
    .flow-card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .flow-card-content {
      color: var(--text-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
