import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      @for (toast of toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-up cursor-pointer hover:scale-105 transition-transform"
          [ngClass]="{
            'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300': toast.type === 'success',
            'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300': toast.type === 'error',
            'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300': toast.type === 'info',
            'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300': toast.type === 'warning'
          }"
          (click)="dismiss(toast.id)"
        >
          <span class="text-lg">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠' : 'ℹ' }}
          </span>
          <span class="text-sm font-medium flex-1">{{ toast.message }}</span>
          <button class="text-xs opacity-50 hover:opacity-100">✕</button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
