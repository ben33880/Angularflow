import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <div class="text-6xl mb-4 opacity-50">{{ icon }}</div>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">{{ title }}</h3>
      <p class="text-slate-600 dark:text-slate-400 max-w-sm">{{ description }}</p>
      @if (actionText) {
        <button 
          class="mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5"
          (click)="action?.()"
        >
          {{ actionText }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: string = '📭';
  @Input() title: string = 'Aucune donnée';
  @Input() description: string = 'Il n\'y a rien à afficher pour le moment.';
  @Input() actionText?: string;
  @Input() action?: () => void;
  @Output() actionClick = new EventEmitter<void>();
}
