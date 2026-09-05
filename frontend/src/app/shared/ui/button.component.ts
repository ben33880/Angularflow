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
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, opacity 0.2s;
    }
    .flow-button-primary {
      background: #2563eb;
      color: #fff;
    }
    .flow-button-primary:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .flow-button-secondary {
      background: #e5e7eb;
      color: #1f2937;
    }
    .flow-button-secondary:hover:not(:disabled) {
      background: #d1d5db;
    }
    .flow-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
