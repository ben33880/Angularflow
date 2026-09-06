import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileConfigService } from '../../services/file-config.service';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { InputComponent } from '../../shared/ui/input.component';
import { ToastService } from '../../shared/ui/toast.service';
import type { DeviceConfig } from '../../models/flowio.models';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, CardComponent, ButtonComponent, InputComponent],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigComponent implements OnInit {
  private readonly fileConfig = inject(FileConfigService);
  private readonly mqtt = inject(MqttService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly configSignal = signal<DeviceConfig | null>(null);
  readonly config = computed(() => this.configSignal());
  readonly mqttConfig = this.fileConfig.config;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);
  readonly mqttConnected = this.mqtt.connected;

  // Form fields
  readonly broker = signal('');
  readonly port = signal('');
  readonly path = signal('');
  readonly username = signal('');
  readonly password = signal('');

  constructor() {
    effect(() => {
      const deviceConfig = this.mqtt.config$();
      if (deviceConfig) this.configSignal.set(deviceConfig);
    });
  }

  ngOnInit(): void {
    const cfg = this.fileConfig.config();
    this.broker.set(cfg.mqtt.broker);
    this.port.set(cfg.mqtt.port.toString());
    this.path.set(cfg.mqtt.path);
    this.username.set(cfg.mqtt.username ?? '');
    this.password.set(cfg.mqtt.password ?? '');
    
    this.mqtt.connect();
    
    this.destroyRef.onDestroy(() => this.mqtt.disconnect());
  }

  async saveMqttConfig(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);
    
    try {
      await this.fileConfig.saveConfig({
        mqtt: {
          broker: this.broker(),
          port: parseInt(this.port(), 10),
          path: this.path(),
          username: this.username() || undefined,
          password: this.password() || undefined
        }
      });
      
      this.saved.set(true);
      this.toast.success('Configuration MQTT sauvegardée ! Reconnexion...');
      
      this.mqtt.disconnect();
      setTimeout(() => this.mqtt.connect(), 500);
    } catch (e) {
      this.error.set('Erreur lors de la sauvegarde');
      this.toast.error('Erreur de sauvegarde');
    } finally {
      this.loading.set(false);
    }
  }

  saveDeviceConfig(): void {
    const cfg = this.configSignal();
    if (!cfg) return;
    
    this.loading.set(true);
    this.error.set(null);
    this.saved.set(false);
    
    this.mqtt.updateConfig(cfg);
    this.toast.success('Configuration appareil envoyée !');
    
    setTimeout(() => {
      this.saved.set(true);
      this.loading.set(false);
    }, 500);
  }

  updateDeviceField(field: 'wifiSsid' | 'wifiPassword', value: string): void {
    this.configSignal.update(config => config ? { ...config, [field]: value } : config);
  }

  reboot(): void {
    if (confirm('Voulez-vous vraiment redémarrer le contrôleur ?')) {
      this.mqtt.reboot();
      this.toast.info('Redémarrage en cours...');
    }
  }
}
