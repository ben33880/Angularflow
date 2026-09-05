import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlowioApiService } from '../../services/flowio-api.service';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import type { DeviceConfig } from '../../models/flowio.models';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [NgIf, FormsModule, CardComponent, ButtonComponent],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent implements OnInit {
  private readonly api = inject(FlowioApiService);
  private readonly mqtt = inject(MqttService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly configSignal = signal<DeviceConfig | null>(null);
  readonly config = computed(() => this.configSignal());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);
  readonly mqttConnected = this.mqtt.connected;

  ngOnInit(): void {
    this.mqtt.connect();
    this.load();
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);
    
    if (!this.mqttConnected()) {
      this.api.getConfig().subscribe({
        next: (c) => {
          this.configSignal.set(c);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Erreur de chargement');
          this.loading.set(false);
        }
      });
    } else {
      // MQTT will push config updates
      this.loading.set(false);
    }
  }

  save(): void {
    const cfg = this.configSignal();
    if (!cfg) return;
    
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);
    
    // Use MQTT to update config
    this.mqtt.updateConfig(cfg);
    
    // Optimistic update
    setTimeout(() => {
      this.saved.set(true);
      this.loading.set(false);
    }, 500);
  }

  reboot(): void {
    if (confirm('Voulez-vous vraiment redé§°marrer le contrôleur ?')) {
      this.mqtt.reboot();
    }
  }
}
