import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'flow-stat-card',
  standalone: true,
  imports: [],
  template: `
    <div class="stat-card card-hover">
      <div class="stat-icon">{{ icon() }}</div>
      <div class="stat-label">{{ label() }}</div>
      <div class="stat-value">
        <ng-content></ng-content>
      </div>
      <div class="stat-unit" *ngIf="unit()">{{ unit() }}</div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      flex: 1;
      min-width: 160px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s;
    }
    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1;
    }
    .stat-unit {
      font-size: 0.875rem;
      color: #94a3b8;
      margin-top: 6px;
      font-weight: 500;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  label = input.required<string>();
  unit = input<string>();
  icon = input<string>('📊');
}
