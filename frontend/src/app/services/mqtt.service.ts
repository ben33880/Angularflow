import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { MqttClient, IClientOptions } from 'mqtt';
import { FileConfigService } from './file-config.service';
import type {
  PoolStatus,
  PoolTemperatures,
  PoolChemistry,
  SystemStatus,
  SystemUptime,
  SystemMemory,
  SystemWifi,
  SystemMqtt,
  LogEntry,
  AlarmEntry,
  DeviceConfig,
  RelayState,
  InputState
} from '../models/flowio.models';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private readonly configService = inject(FileConfigService);
  private readonly ngZone = inject(NgZone);
  
  private client: MqttClient | null = null;
  private readonly connectedSignal = signal(false);
  readonly connected = computed(() => this.connectedSignal());

  // Status streams
  private readonly poolStatusSignal = signal<PoolStatus | null>(null);
  private readonly temperaturesSignal = signal<PoolTemperatures | null>(null);
  private readonly chemistrySignal = signal<PoolChemistry | null>(null);
  private readonly systemStatusSignal = signal<SystemStatus | null>(null);
  
  readonly poolStatus$ = this.poolStatusSignal.asReadonly();
  readonly temperatures$ = this.temperaturesSignal.asReadonly();
  readonly chemistry$ = this.chemistrySignal.asReadonly();
  readonly systemStatus$ = this.systemStatusSignal.asReadonly();

  // System detail streams
  private readonly systemUptimeSignal = signal<SystemUptime | null>(null);
  private readonly systemMemorySignal = signal<SystemMemory | null>(null);
  private readonly systemWifiSignal = signal<SystemWifi | null>(null);
  private readonly systemMqttSignal = signal<SystemMqtt | null>(null);
  
  readonly systemUptime$ = this.systemUptimeSignal.asReadonly();
  readonly systemMemory$ = this.systemMemorySignal.asReadonly();
  readonly systemWifi$ = this.systemWifiSignal.asReadonly();
  readonly systemMqtt$ = this.systemMqttSignal.asReadonly();

  // Logs streams
  private readonly logsInfoSignal = signal<LogEntry | null>(null);
  private readonly logsWarnSignal = signal<LogEntry | null>(null);
  private readonly logsErrorSignal = signal<LogEntry | null>(null);
  
  readonly logsInfo$ = this.logsInfoSignal.asReadonly();
  readonly logsWarn$ = this.logsWarnSignal.asReadonly();
  readonly logsError$ = this.logsErrorSignal.asReadonly();

  // Alarms streams
  private readonly alarmsActiveSignal = signal<AlarmEntry[]>([]);
  private readonly alarmsHistorySignal = signal<AlarmEntry[]>([]);
  
  readonly alarmsActive$ = this.alarmsActiveSignal.asReadonly();
  readonly alarmsHistory$ = this.alarmsHistorySignal.asReadonly();

  // Config stream
  private readonly configSignal = signal<DeviceConfig | null>(null);
  readonly config$ = this.configSignal.asReadonly();

  // Relays & Inputs streams
  private readonly relaysSignal = signal<RelayState[]>([]);
  private readonly inputsSignal = signal<InputState[]>([]);
  
  readonly relays$ = this.relaysSignal.asReadonly();
  readonly inputs$ = this.inputsSignal.asReadonly();

  constructor() {}

  connect(): void {
    const cfg = this.configService.config();
    
    const options: IClientOptions = {
      clientId: `flowio-web-${Math.random().toString(16).slice(3)}`,
      username: cfg.mqtt.username || undefined,
      password: cfg.mqtt.password || undefined,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    };

    const brokerUrl = this.configService.getBrokerUrl();
    console.log('[MQTT] Connecting to', brokerUrl);

    try {
      this.client = new MqttClient(brokerUrl, options);

      this.client.on('connect', () => {
        console.log('[MQTT] Connected!');
        this.ngZone.run(() => {
          this.connectedSignal.set(true);
          this.subscribe();
        });
      });

      this.client.on('error', (error: Error) => {
        console.error('[MQTT] Error:', error);
        this.ngZone.run(() => {
          this.connectedSignal.set(false);
        });
      });

      this.client.on('offline', () => {
        console.log('[MQTT] Offline');
        this.ngZone.run(() => {
          this.connectedSignal.set(false);
        });
      });

      this.client.on('close', () => {
        console.log('[MQTT] Connection closed');
        this.ngZone.run(() => {
          this.connectedSignal.set(false);
        });
      });

      this.client.on('message', (topic: string, payload: Buffer) => {
        this.ngZone.run(() => {
          this.handleMessage(topic, payload.toString());
        });
      });
    } catch (error) {
      console.error('[MQTT] Connection failed:', error);
      this.connectedSignal.set(false);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = null;
      this.connectedSignal.set(false);
    }
  }

  private subscribe(): void {
    if (!this.client) return;

    const topics = [
      'flowio/pool/status',
      'flowio/pool/temperatures',
      'flowio/pool/chemistry',
      'flowio/system/status',
      'flowio/system/uptime',
      'flowio/system/memory',
      'flowio/system/wifi',
      'flowio/system/mqtt',
      'flowio/logs/info',
      'flowio/logs/warn',
      'flowio/logs/error',
      'flowio/alarms/active',
      'flowio/alarms/history',
      'flowio/device/config',
      'flowio/relays/state',
      'flowio/inputs/state'
    ];

    this.client.subscribe(topics, { qos: 0 }, (err) => {
      if (err) {
        console.error('[MQTT] Subscribe error:', err);
      } else {
        console.log('[MQTT] Subscribed to', topics.length, 'topics');
      }
    });
  }

  private handleMessage(topic: string, payload: string): void {
    try {
      const data = JSON.parse(payload);

      switch (topic) {
        case 'flowio/pool/status':
          this.poolStatusSignal.set(data);
          break;
        case 'flowio/pool/temperatures':
          this.temperaturesSignal.set(data);
          break;
        case 'flowio/pool/chemistry':
          this.chemistrySignal.set(data);
          break;
        case 'flowio/system/status':
          this.systemStatusSignal.set(data);
          break;
        case 'flowio/system/uptime':
          this.systemUptimeSignal.set(data);
          break;
        case 'flowio/system/memory':
          this.systemMemorySignal.set(data);
          break;
        case 'flowio/system/wifi':
          this.systemWifiSignal.set(data);
          break;
        case 'flowio/system/mqtt':
          this.systemMqttSignal.set(data);
          break;
        case 'flowio/logs/info':
          this.logsInfoSignal.set(data);
          break;
        case 'flowio/logs/warn':
          this.logsWarnSignal.set(data);
          break;
        case 'flowio/logs/error':
          this.logsErrorSignal.set(data);
          break;
        case 'flowio/alarms/active':
          this.alarmsActiveSignal.set(data);
          break;
        case 'flowio/alarms/history':
          this.alarmsHistorySignal.set(data);
          break;
        case 'flowio/device/config':
          this.configSignal.set(data);
          break;
        case 'flowio/relays/state':
          this.relaysSignal.set(data);
          break;
        case 'flowio/inputs/state':
          this.inputsSignal.set(data);
          break;
      }
    } catch (e) {
      console.error('[MQTT] Failed to parse message:', topic, e);
    }
  }

  // Commands
  setFiltration(on: boolean): void {
    this.publish('flowio/cmd/pool/filtration', { on });
  }

  setChlorine(on: boolean): void {
    this.publish('flowio/cmd/pool/chlorine', { on });
  }

  setPhDosing(on: boolean): void {
    this.publish('flowio/cmd/pool/ph', { on });
  }

  setRelay(id: number, on: boolean): void {
    this.publish(`flowio/cmd/relay/${id}`, { on });
  }

  updateConfig(config: DeviceConfig): void {
    this.publish('flowio/cmd/config/update', config);
  }

  reboot(): void {
    this.publish('flowio/cmd/system/reboot', {});
  }

  acknowledgeAlarm(id: string): void {
    this.publish('flowio/cmd/alarm/ack', { id });
  }

  private publish(topic: string, payload: any): void {
    if (!this.client || !this.connectedSignal()) {
      console.warn('[MQTT] Cannot publish - not connected');
      return;
    }
    
    this.client.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
      if (err) {
        console.error('[MQTT] Publish error:', err);
      }
    });
  }
}
