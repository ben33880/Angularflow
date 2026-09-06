import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.component.html'
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
}
