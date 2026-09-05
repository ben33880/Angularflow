import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MqttConfigService } from '../../services/mqtt-config.service';
import { MqttService } from '../../services/mqtt.service';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { InputComponent } from '../../shared/ui/input.component';

@Component({
  selector: 'app-mqtt-setup',
  standalone: true,
  imports: [NgIf, FormsModule, CardComponent, ButtonComponent, InputComponent],
  templateUrl: './mqtt-setup.component.html',
  styleUrls: ['./mqtt-setup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MqttSetupComponent {
  private readonly configService = inject(MqttConfigService);
  private readonly mqttService = inject(MqttService);
  private readonly router = inject(Router);

  readonly broker = signal('');
  readonly port = signal('1883');
  readonly path = signal('/mqtt');
  readonly username = signal('');
  readonly password = signal('');
  
  readonly connecting = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal(false);

  readonly config = this.configService.config();

  constructor() {
    // Pre-fill with saved config
    const cfg = this.configService.config();
    this.broker.set(cfg.broker);
    this.port.set(cfg.port.toString());
    this.path.set(cfg.path);
    this.username.set(cfg.username ?? '');
    this.password.set(cfg.password ?? '');
  }

  saveAndConnect(): void {
    this.connecting.set(true);
    this.error.set(null);
    this.success.set(false);

    try {
      this.configService.saveConfig({
        broker: this.broker(),
        port: parseInt(this.port(), 10),
        path: this.path(),
        username: this.username() || undefined,
        password: this.password() || undefined
      });

      // Test connection
      this.mqttService.connect();
      
      // Wait for connection
      setTimeout(() => {
        if (this.mqttService.connected()) {
          this.success.set(true);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } else {
          this.error.set('É§chec de connexion au broker MQTT. Vérifiez les paramètres.');
          this.connecting.set(false);
        }
      }, 2000);
    } catch (e) {
      this.error.set('Erreur lors de la sauvegarde de la configuration');
      this.connecting.set(false);
    }
  }

  skip(): void {
    this.router.navigate(['/dashboard']);
  }
}
