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
        console.log('[Config] Loaded from /config.json', this.configSignal());
      }
    } catch (e) {
      console.warn('[Config] Failed to load /config.json, using defaults', e);
      this.configSignal.set(DEFAULT_CONFIG);
    }
  }

  async saveConfig(newConfig: Partial<AppConfig>): Promise<void> {
    const current = this.configSignal();
    const updated = {
      mqtt: { ...current.mqtt, ...newConfig.mqtt },
      device: { ...current.device, ...newConfig.device }
    };
    
    // In Docker setup, this would write to the mounted config.json
    // For now, we update the signal and log the change
    this.configSignal.set(updated);
    console.log('[Config] Updated config (would write to mounted volume):', updated);
    
    // Trigger a reload to get the updated file
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
