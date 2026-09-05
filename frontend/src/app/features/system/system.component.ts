import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import type { SystemStatus } from '../../models/flowio.models';

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [NgIf, CardComponent],
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly systemSignal = signal<SystemStatus | null>(null);
  readonly system = computed(() => this.systemSignal());
  readonly mqttConnected = this.mqtt.connected;

  constructor() {
    this.mqtt.systemStatus$.subscribe(sys => {
      if (sys) this.systemSignal.set(sys);
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }
}
