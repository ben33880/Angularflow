import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import type { RelayState, InputState } from '../../models/flowio.models';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [NgIf, NgFor, CardComponent, ButtonComponent],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly relaysSignal = signal<RelayState[]>([]);
  private readonly inputsSignal = signal<InputState[]>([]);
  
  readonly relays = computed(() => this.relaysSignal());
  readonly inputs = computed(() => this.inputsSignal());
  readonly mqttConnected = this.mqtt.connected;

  constructor() {
    this.mqtt.relays$.subscribe(relays => {
      if (relays) this.relaysSignal.set(relays);
    });
    
    this.mqtt.inputs$.subscribe(inputs => {
      if (inputs) this.inputsSignal.set(inputs);
    });
  }

  ngOnInit(): void {
    this.mqtt.connect();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  toggleRelay(id: number, currentState: boolean): void {
    this.mqtt.setRelay(id, !currentState);
  }
}
