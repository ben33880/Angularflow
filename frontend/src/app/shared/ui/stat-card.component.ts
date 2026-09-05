import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stat-card.component.html'
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
}
