import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="stat-card">
      <div class="stat-label">{{ label() }}</div>
      <div class="stat-value">
        <ng-content></ng-content>
      </div>
      <div class="stat-unit" *ngIf="unit()">{{ unit() }}</div>
      <div class="stat-glow"></div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      text-align: center;
      flex: 1;
      min-width: 140px;
      position: relative;
      overflow: hidden;
      transition: var(--transition);
      animation: statEnter 0.6s ease-out;
    }
    .stat-card:hover {
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.15);
      transform: translateY(-4px) scale(1.02);
    }
    .stat-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: var(--transition);
    }
    .stat-card:hover .stat-glow {
      opacity: 1;
    }
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    .stat-unit {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 8px;
      font-weight: 500;
    }
    @keyframes statEnter {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
}
