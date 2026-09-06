import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { MqttService } from '../../services/mqtt.service';
import { FileConfigService } from '../../services/file-config.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgClass],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  private readonly mqtt = inject(MqttService);
  private readonly configService = inject(FileConfigService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  readonly mqttConnected = this.mqtt.connected;
  readonly mqttConfig = computed(() => this.configService.config().mqtt);
  readonly isConfigured = this.configService.isConfigured;

  readonly navItems = [
    { path: '/dashboard', key: 'dashboard', icon: '📊' },
    { path: '/system', key: 'system', icon: '⚙️' },
    { path: '/relays', key: 'relays', icon: '🔌' },
    { path: '/inputs', key: 'inputs', icon: '📡' },
    { path: '/logs', key: 'logs', icon: '📋' },
    { path: '/alarms', key: 'alarms', icon: '🚨' },
    { path: '/config', key: 'config', icon: '🔧' }
  ];

  ngOnInit(): void {
    if (this.isConfigured()) {
      this.mqtt.connect();
    }
  }

  openSettings(): void {
    this.router.navigate(['/config']);
  }
}
