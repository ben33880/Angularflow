import { Injectable, signal, computed, inject } from '@angular/core';
import { MqttClient, IClientOptions } from 'mqtt';
import { FileConfigService } from './file-config.service';
import { LoggerService } from '../shared/services/logger.service';
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
  private readonly logger = inject(LoggerService);
  
  private client: MqttClient | null = null;
  private readonly connectedSignal = signal(false);
  readonly connected = computed(() => this.connectedSignal());

  private readonly poolStatusSignal = signal<PoolStatus | null>(null);
  private readonly temperaturesSignal = signal<PoolTemperatures | null>(null);
  private readonly chemistrySignal = signal<PoolChemistry | null>(null);
  private readonly systemStatusSignal = signal<SystemStatus | null>(null);
  
  readonly poolStatus$ = this.poolStatusSignal.asReadonly();
  readonly temperatures$ = this.temperaturesSignal.asReadonly();
  readonly chemistry$ = this.chemistrySignal.asReadonly();
  readonly systemStatus$ = this.systemStatusSignal.asReadonly();

  private readonly systemUptimeSignal = signal<SystemUptime | null>(null);
  private readonly systemMemorySignal = signal<SystemMemory | null>(null);
  private readonly systemWifiSignal = signal<SystemWifi | null>(null);
  private readonly systemMqttSignal = signal<SystemMqtt | null>(null);
  
  readonly systemUptime$ = this.systemUptimeSignal.asReadonly();
  readonly systemMemory$ = this.systemMemorySignal.asReadonly();
  readonly systemWifi$ = this.systemWifiSignal.asReadonly();
  readonly systemMqtt$ = this.systemMqttSignal.asReadonly();

  private readonly logsInfoSignal = signal<LogEntry | null>(null);
  private readonly logsWarnSignal = signal<LogEntry | null>(null);
  private readonly logsErrorSignal = signal<LogEntry | null>(null);
  
  readonly logsInfo$ = this.logsInfoSignal.asReadonly();
  readonly logsWarn$ = this.logsWarnSignal.asReadonly();
  readonly logsError$ = this.logsErrorSignal.asReadonly();

  private readonly alarmsActiveSignal = signal<AlarmEntry[]>([]);
  private readonly alarmsHistorySignal = signal<AlarmEntry[]>([]);
  
  readonly alarmsActive$ = this.alarmsActiveSignal.asReadonly();
  readonly alarmsHistory$ = this.alarmsHistorySignal.asReadonly();

  private readonly configSignal = signal<DeviceConfig | null>(null);
  readonly config$ = this.configSignal.asReadonly();

  private readonly relaysSignal = signal<RelayState[]>([]);
  private readonly inputsSignal = signal<InputState[]>([]);
  
  readonly relays$ = this.relaysSignal.asReadonly();
  readonly inputs$ = this.inputsSignal.asReadonly();

  constructor() {}

  connect(): void {
    const cfg = this.configService.config();
    const brokerUrl = `ws://${cfg.mqtt.broker}:${cfg.mqtt.port}${cfg.mqtt.path}`;

    this.logger.info(`Connecting to ${brokerUrl}`, 'MQTT');

    const options: IClientOptions = {
      clientId: `flowio-web-${Math.random().toString(16).slice(3)}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 10000,
    };

    if (cfg.mqtt.username && cfg.mqtt.password) {
      options.username = cfg.mqtt.username;
      options.password = cfg.mqtt.password;
    }

    this.client = new MqttClient(brokerUrl, options);
    
    this.client.on('connect', () => {
      this.logger.info('Connected', 'MQTT');
      this.connectedSignal.set(true);
      this.subscribe();
    });

    this.client.on('close', () => {
      this.logger.warn('Disconnected', 'MQTT');
      this.connectedSignal.set(false);
    });

    this.client.on('error', (error) => {
      this.logger.error(`Error: ${error.message}`, 'MQTT');
      this.connectedSignal.set(false);
    });

    this.client.on('message', (topic: string, message: Buffer) => {
      this.handleMessage(topic, message.toString());
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = null;
      this.logger.info('Disconnected by user', 'MQTT');
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

    this.client.subscribe(topics, { qos: 0 });
    this.logger.debug(`Subscribed to ${topics.length} topics`, 'MQTT');
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
    } catch (error) {
      this.logger.error(`Failed to parse message: ${topic}`, 'MQTT');
    }
  }

  setFiltration(on: boolean): void {
    this.logger.info(`Filtration: ${on ? 'ON' : 'OFF'}`, 'MQTT');
    this.publish('flowio/cmd/pool/filtration', { on });
  }

  setChlorine(on: boolean): void {
    this.logger.info(`Chlorine: ${on ? 'ON' : 'OFF'}`, 'MQTT');
    this.publish('flowio/cmd/pool/chlorine', { on });
  }

  setPhDosing(on: boolean): void {
    this.logger.info(`pH Dosing: ${on ? 'ON' : 'OFF'}`, 'MQTT');
    this.publish('flowio/cmd/pool/ph', { on });
  }

  setRelay(id: number, on: boolean): void {
    this.logger.info(`Relay ${id}: ${on ? 'ON' : 'OFF'}`, 'MQTT');
    this.publish(`flowio/cmd/relay/${id}`, { on });
  }

  updateConfig(config: DeviceConfig): void {
    this.logger.info('Config updated', 'MQTT');
    this.publish('flowio/cmd/config/update', config);
  }

  reboot(): void {
    this.logger.warn('System reboot requested', 'MQTT');
    this.publish('flowio/cmd/system/reboot', {});
  }

  acknowledgeAlarm(id: string): void {
    this.logger.info(`Alarm acknowledged: ${id}`, 'MQTT');
    this.publish('flowio/cmd/alarm/ack', { id });
  }

  private publish(topic: string, payload: any): void {
    if (!this.client || !this.connectedSignal()) {
      this.logger.warn('Cannot publish - not connected', 'MQTT');
      return;
    }
    this.client.publish(topic, JSON.stringify(payload), { qos: 0 });
  }
}
