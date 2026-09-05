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
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
