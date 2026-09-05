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
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: var(--shadow);
      transition: var(--transition);
      animation: cardEnter 0.5s ease-out;
    }
    .flow-card:hover {
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: var(--shadow-lg), 0 0 20px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }
    .flow-card-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .flow-card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .flow-card-content {
      color: var(--text-primary);
    }
    @keyframes cardEnter {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
