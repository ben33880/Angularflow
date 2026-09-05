import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-button',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      class="flow-button"
      [class.flow-button-primary]="variant() === 'primary'"
      [class.flow-button-secondary]="variant() === 'secondary'"
      [disabled]="disabled()"
      (click)="clicked.emit()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .flow-button {
      border: none;
      border-radius: 0.75rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }
    .flow-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    .flow-button:hover::before {
      left: 100%;
    }
    .flow-button-primary {
      background: var(--gradient-primary);
      color: #fff;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    .flow-button-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
    }
    .flow-button-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .flow-button-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
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
  variant = input<'primary' | 'secondary'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
