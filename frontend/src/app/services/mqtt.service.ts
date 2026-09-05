import { Injectable, signal, computed, inject } from '@angular/core';
import { FileConfigService } from './file-config.service';
import type { AppConfig } from './file-config.service';
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

interface MqttMessage {
  topic: string;
  payload: string;
}

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private readonly configService = inject(FileConfigService);
  
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
    const brokerUrl = this.configService.getBrokerUrl();
    const cfg = this.configService.config();

    console.log('[MQTT] Connecting to', brokerUrl);

    this.client = new MqttClient(brokerUrl, `flowio-web-${Math.random().toString(16).slice(3)}`);
    
    this.client.onConnect = () => {
      console.log('[MQTT] Connected!');
      this.connectedSignal.set(true);
      this.subscribe();
    };

    this.client.onDisconnect = () => {
      console.log('[MQTT] Disconnected');
      this.connectedSignal.set(false);
    };

    this.client.onError = (error: Error) => {
      console.error('[MQTT] Error:', error);
      this.connectedSignal.set(false);
    };

    this.client.onMessage = (topic: string, payload: string) => {
      this.handleMessage(topic, payload);
    };

    this.client.connect();
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }

  private subscribe(): void {
    if (!this.client) return;

    // Pool status
    this.client.subscribe('flowio/pool/status');
    this.client.subscribe('flowio/pool/temperatures');
    this.client.subscribe('flowio/pool/chemistry');
    
    // System
    this.client.subscribe('flowio/system/status');
    this.client.subscribe('flowio/system/uptime');
    this.client.subscribe('flowio/system/memory');
    this.client.subscribe('flowio/system/wifi');
    this.client.subscribe('flowio/system/mqtt');
    
    // Logs
    this.client.subscribe('flowio/logs/info');
    this.client.subscribe('flowio/logs/warn');
    this.client.subscribe('flowio/logs/error');
    
    // Alarms
    this.client.subscribe('flowio/alarms/active');
    this.client.subscribe('flowio/alarms/history');
    
    // Config
    this.client.subscribe('flowio/device/config');
    
    // Relays & Inputs
    this.client.subscribe('flowio/relays/state');
    this.client.subscribe('flowio/inputs/state');
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
    this.client.publish(topic, JSON.stringify(payload));
  }
}

// Simple MQTT client wrapper
class MqttClient {
  private ws: WebSocket | null = null;
  private clientId: string;
  private keepAlive = 60;

  onConnect: (() => void) | null = null;
  onDisconnect: (() => void) | null = null;
  onError: ((error: Error) => void) | null = null;
  onMessage: ((topic: string, payload: string) => void) | null = null;

  constructor(
    private url: string,
    clientId: string
  ) {
    this.clientId = clientId;
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        // Send CONNECT frame
        this.sendConnect();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = () => {
        this.onDisconnect?.();
      };

      this.ws.onerror = (error) => {
        this.onError?.(new Error('WebSocket error'));
      };
    } catch (e) {
      this.onError?.(e as Error);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.sendDisconnect();
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(topic: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    // SUBSCRIBE frame
    const frame = this.createSubscribeFrame(topic);
    this.ws.send(frame);
  }

  publish(topic: string, payload: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    
    // PUBLISH frame
    const frame = this.createPublishFrame(topic, payload);
    this.ws.send(frame);
  }

  private sendConnect(): void {
    if (!this.ws) return;
    
    // Simple CONNECT frame for MQTT over WebSocket
    const frame = new Uint8Array([
      0x10, // CONNECT
      0x00, 0x00, // Remaining length (placeholder)
      0x00, 0x04, 'M'.charCodeAt(0), 'Q'.charCodeAt(0), 'T'.charCodeAt(0), 'T'.charCodeAt(0), // Protocol name
      0x04, // Protocol level
      0x02, // Connect flags
      0x00, 0x3c, // Keep alive (60s)
      ...this.encodeString(this.clientId) // Client ID
    ]);
    
    // Update remaining length
    frame[1] = frame.length - 2;
    
    this.ws.send(frame);
    
    // Simulate connected after short delay
    setTimeout(() => this.onConnect?.(), 100);
  }

  private sendDisconnect(): void {
    if (!this.ws) return;
    
    const frame = new Uint8Array([0xe0, 0x00]); // DISCONNECT
    this.ws.send(frame);
  }

  private createSubscribeFrame(topic: string): Uint8Array {
    const topicBytes = this.encodeString(topic);
    const frame = new Uint8Array([
      0x82, // SUBSCRIBE
      topicBytes.length + 3,
      0x00, 0x01, // Message ID
      ...topicBytes,
      0x00 // QoS 0
    ]);
    return frame;
  }

  private createPublishFrame(topic: string, payload: string): Uint8Array {
    const topicBytes = this.encodeString(topic);
    const payloadBytes = new TextEncoder().encode(payload);
    const frame = new Uint8Array([
      0x30, // PUBLISH
      topicBytes.length + payloadBytes.length + 2,
      ...topicBytes,
      0x00, 0x01, // Message ID
      ...payloadBytes
    ]);
    return frame;
  }

  private handleMessage(data: ArrayBuffer): void {
    const view = new Uint8Array(data);
    
    if (view.length < 2) return;
    
    const packetType = view[0] & 0xf0;
    
    // PUBLISH packet (0x30)
    if (packetType === 0x30) {
      // Parse topic and payload
      const topicLength = (view[2] << 8) | view[3];
      const topicBytes = view.slice(4, 4 + topicLength);
      const topic = new TextDecoder().decode(topicBytes);
      const payloadBytes = view.slice(4 + topicLength + 2); // Skip message ID
      const payload = new TextDecoder().decode(payloadBytes);
      
      this.onMessage?.(topic, payload);
    }
  }

  private encodeString(str: string): Uint8Array {
    const bytes = new TextEncoder().encode(str);
    const result = new Uint8Array(bytes.length + 2);
    result[0] = (bytes.length >> 8) & 0xff;
    result[1] = bytes.length & 0xff;
    result.set(bytes, 2);
    return result;
  }
}
