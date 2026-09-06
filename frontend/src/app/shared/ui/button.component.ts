import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button, flow-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [class.bg-blue-600]="variant() === 'primary'"
      [class.hover:bg-blue-700]="variant() === 'primary'"
      [class.bg-slate-200]="variant() === 'secondary'"
      [class.hover:bg-slate-300]="variant() === 'secondary'"
      [class.text-slate-800]="variant() === 'secondary'"
      [class.bg-red-600]="variant() === 'danger'"
      [class.hover:bg-red-700]="variant() === 'danger'"
      [disabled]="disabled()"
      (click)="clicked.emit()"
      class="inline-flex items-center gap-2 rounded-xl border-none px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
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
