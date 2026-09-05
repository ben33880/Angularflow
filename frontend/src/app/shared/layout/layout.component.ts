import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { MqttConfigService } from '../../services/mqtt-config.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor, NgClass],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly configService = inject(MqttConfigService);
  private readonly router = inject(Router);

  readonly mqttConnected = this.mqtt.connected;
  readonly mqttConfig = this.configService.config;
  readonly isConfigured = this.configService.isConfigured;

  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/system', label: 'System', icon: '⚙️' },
    { path: '/relays', label: 'Relays', icon: '🔌' },
    { path: '/inputs', label: 'Inputs', icon: '📡' },
    { path: '/logs', label: 'Logs', icon: '📋' },
    { path: '/alarms', label: 'Alarms', icon: '🚨' },
    { path: '/config', label: 'Config', icon: '🔧' }
  ];

  ngOnInit(): void {
    if (this.isConfigured()) {
      this.mqtt.connect();
    }
  }

  openSettings(): void {
    this.router.navigate(['/setup']);
  }
}
