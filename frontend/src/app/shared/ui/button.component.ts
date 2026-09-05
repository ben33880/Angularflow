import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'flow-button',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      [class.btn-primary]="variant() === 'primary'"
      [class.btn-secondary]="variant() === 'secondary'"
      [disabled]="disabled()"
      (click)="clicked.emit()"
      class="border-none rounded-xl py-3 px-6 text-sm font-semibold cursor-pointer transition-all duration-200 inline-flex items-center gap-2 relative overflow-hidden">
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
