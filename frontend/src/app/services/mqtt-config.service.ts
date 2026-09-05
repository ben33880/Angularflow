import { Injectable, signal, computed, inject } from '@angular/core';

export interface MqttConfig {
  broker: string;
  port: number;
  path: string;
  username?: string;
  password?: string;
  clientId: string;
}

const DEFAULT_CONFIG: MqttConfig = {
  broker: 'localhost',
  port: 1883,
  path: '/mqtt',
  clientId: `flowio-web-${Math.random().toString(16).slice(3)}`
};

const STORAGE_KEY = 'flowio_mqtt_config';

@Injectable({
  providedIn: 'root'
})
export class MqttConfigService {
  private readonly configSignal = signal<MqttConfig>(this.loadConfig());
  readonly config = computed(() => this.configSignal());
  readonly isConfigured = computed(() => {
    const cfg = this.configSignal();
    return cfg.broker.length > 0 && cfg.port > 0;
  });

  constructor() {}

  private loadConfig(): MqttConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load MQTT config from localStorage', e);
    }
    return DEFAULT_CONFIG;
  }

  saveConfig(config: Partial<MqttConfig>): void {
    const current = this.configSignal();
    const updated = { ...current, ...config };
    
    // Generate new clientId if broker changed
    if (config.broker && config.broker !== current.broker) {
      updated.clientId = `flowio-web-${Math.random().toString(16).slice(3)}`;
    }
    
    this.configSignal.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  resetConfig(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.configSignal.set(DEFAULT_CONFIG);
  }

  getBrokerUrl(): string {
    const cfg = this.configSignal();
    return `ws://${cfg.broker}:${cfg.port}${cfg.path}`;
  }
}
