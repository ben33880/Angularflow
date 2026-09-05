import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div class="text-center">
        <div class="text-9xl font-bold text-slate-200 dark:text-slate-700 mb-4">404</div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">Page non trouvÃ©e</h1>
        <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          La page que vous recherchez n'existe pas ou a ÃtÃ© dÃ©placÃ©e.
        </p>
        <a
          routerLink="/dashboard"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5"
        >
          <span>â¬°</span>
          <span>Retour au Dashboard</span>
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
