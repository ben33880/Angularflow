import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card, flow-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-700" *ngIf="title()">
        <h3 class="m-0 text-lg font-bold text-slate-900 dark:text-white">{{ title() }}</h3>
      </div>
      <div class="p-6 text-slate-700 dark:text-slate-200">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  title = input<string>();
}
