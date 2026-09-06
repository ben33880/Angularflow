import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button, flow-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [class.btn-primary]="variant() === 'primary'"
      [class.btn-secondary]="variant() === 'secondary'"
      [class.btn-danger]="variant() === 'danger'"
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
  variant = input<'primary' | 'secondary' | 'danger'>('secondary');
  disabled = input(false);
  clicked = output<void>();
}
