import { Injectable, signal, computed } from '@angular/core';

export interface AppConfig {
  mqtt: {
    broker: string;
    port: number;
    path: string;
    username?: string;
    password?: string;
  };
  device: {
    name: string;
    location?: string;
  };
}

const DEFAULT_CONFIG: AppConfig = {
  mqtt: {
    broker: 'localhost',
    port: 1883,
    path: '/mqtt',
    username: '',
    password: ''
  },
  device: {
    name: 'Flow.io Pool Controller',
    location: ''
  }
};

const STORAGE_KEY = 'flowio_mqtt_config';

@Injectable({
  providedIn: 'root'
})
export class FileConfigService {
  private readonly configSignal = signal<AppConfig>(DEFAULT_CONFIG);
  readonly config = computed(() => this.configSignal());
  readonly isConfigured = computed(() => {
    const cfg = this.configSignal();
    return cfg.mqtt.broker.length > 0 && cfg.mqtt.port > 0;
  });

  constructor() {
    this.loadConfig();
  }

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/config.json');
      if (response.ok) {
        const loaded = await response.json();
        this.configSignal.set({ ...DEFAULT_CONFIG, ...loaded });
      }
    } catch {
      this.configSignal.set(DEFAULT_CONFIG);
    }
  }

  async saveConfig(newConfig: Partial<AppConfig>): Promise<void> {
    const current = this.configSignal();
    const updated = {
      mqtt: { ...current.mqtt, ...newConfig.mqtt },
      device: { ...current.device, ...newConfig.device }
    };
    
    this.configSignal.set(updated);
    await this.loadConfig();
  }

  resetConfig(): void {
    this.configSignal.set(DEFAULT_CONFIG);
  }

  getBrokerUrl(): string {
    const cfg = this.configSignal();
    return `ws://${cfg.mqtt.broker}:${cfg.mqtt.port}${cfg.mqtt.path}`;
  }
}
