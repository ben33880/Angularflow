import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="stat-card">
      <div class="stat-icon">
        <i class="bi bi-activity"></i>
      </div>
      <div class="stat-label">{{ label() }}</div>
      <div class="stat-value">
        <ng-content></ng-content>
      </div>
      <div class="stat-unit" *ngIf="unit()">{{ unit() }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
      border-radius: 1rem;
      padding: 1.5rem;
      text-align: center;
      flex: 1;
      min-width: 140px;
      border: 1px solid rgba(59, 130, 246, 0.2);
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      animation: rotate 10s linear infinite;
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .stat-card > * {
      position: relative;
      z-index: 1;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    }
    .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }
    .stat-unit {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
}
