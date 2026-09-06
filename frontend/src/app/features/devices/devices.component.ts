import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import type { RelayState, InputState } from '../../models/flowio.models';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly relaysSignal = signal<RelayState[]>([]);
  private readonly inputsSignal = signal<InputState[]>([]);
  
  readonly relays = computed(() => this.relaysSignal());
  readonly inputs = computed(() => this.inputsSignal());
  readonly mqttConnected = this.mqtt.connected;
  readonly view = signal<'relays' | 'inputs'>('relays');

  constructor() {
    effect(() => {
      const relays = this.mqtt.relays$();
      if (relays) this.relaysSignal.set(relays);
    });
    
    effect(() => {
      const inputs = this.mqtt.inputs$();
      if (inputs) this.inputsSignal.set(inputs);
    });
  }

  ngOnInit(): void {
    this.view.set(this.route.snapshot.routeConfig?.path === 'inputs' ? 'inputs' : 'relays');
    this.mqtt.connect();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  toggleRelay(id: number, currentState: boolean): void {
    this.mqtt.setRelay(id, !currentState);
  }

  formatIndex(id: number): string {
    return id.toString().padStart(2, '0');
  }
}
