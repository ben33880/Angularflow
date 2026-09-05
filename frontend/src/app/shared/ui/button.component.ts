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
      <span class="button-content">
        <ng-content></ng-content>
      </span>
      <span class="button-shine"></span>
    </button>
  `,
  styles: [`
    .flow-button {
      position: relative;
      border: none;
      border-radius: var(--radius-sm);
      padding: 10px 20px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      overflow: hidden;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .flow-button-primary {
      background: var(--accent-gradient);
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    .flow-button-primary:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
      transform: translateY(-2px);
    }
    .flow-button-primary:hover:not(:disabled) .button-shine {
      animation: shine 0.6s;
    }
    .flow-button-secondary {
      background: rgba(148, 163, 184, 0.1);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }
    .flow-button-secondary:hover:not(:disabled) {
      background: rgba(148, 163, 184, 0.2);
      border-color: rgba(148, 163, 184, 0.3);
      transform: translateY(-1px);
    }
    .flow-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .button-content {
      position: relative;
      z-index: 1;
    }
    .button-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: none;
    }
    @keyframes shine {
      from {
        left: -100%;
      }
      to {
        left: 100%;
      }
    }
    @keyframes buttonEnter {
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
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
