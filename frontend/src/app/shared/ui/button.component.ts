import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'flow-button',
  standalone: true,
  imports: [],
  template: `
    <button
      class="flow-button"
      [class.flow-button-primary]="variant() === 'primary'"
      [class.flow-button-secondary]="variant() === 'secondary'"
      [class.flow-button-danger]="variant() === 'danger'"
      [disabled]="disabled()"
      (click)="clicked.emit()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .flow-button {
      border: none;
      border-radius: 10px;
      padding: 12px 24px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .flow-button-primary {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #fff;
    }
    .flow-button-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }
    .flow-button-secondary {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      color: #475569;
    }
    .flow-button-secondary:hover:not(:disabled) {
      background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
      transform: translateY(-2px);
    }
    .flow-button-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff;
    }
    .flow-button-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
    .flow-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
