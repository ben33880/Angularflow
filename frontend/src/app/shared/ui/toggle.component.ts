import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      [ngClass]="checked ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'"
      (click)="toggle()"
      [disabled]="disabled"
    >
      <span
        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        [ngClass]="checked ? 'translate-x-6' : 'translate-x-1'"
      />
    </button>
  `
})
export class ToggleComponent {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.checkedChange.emit(!this.checked);
    }
  }
}
