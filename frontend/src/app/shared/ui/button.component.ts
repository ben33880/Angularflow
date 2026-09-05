import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-button',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      [class]="variant() === 'primary' ? 'btn-primary' : 'btn-secondary'"
      [disabled]="disabled()"
      (click)="clicked.emit()">
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
