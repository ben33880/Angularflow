import { Injectable, signal, Signal, DestroyRef, inject } from '@angular/core';
import { MqttClient, MqttConnectionOptions } from 'mqtt';
import { Observable, Subject, share, filter, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  PoolStatus,
  PoolTemperatures,
  PoolChemistry,
  LogEntry,
  AlarmEntry,
  SystemStatus,
  RelayState,
  InputState
} from '../models/flowio.models';

export interface MqttMessage {
  topic: string;
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class MqttService {
  private client?: MqttClient;
  private readonly messagesSubject = new Subject<MqttMessage>();
  private readonly destroyRef = inject(DestroyRef);
  
  private readonly connectedSignal = signal(false);
  readonly connected: Signal<boolean> = this.connectedSignal.asReadonly();
  
  readonly messages$: Observable<MqttMessage> = this.messagesSubject.asObservable().pipe(share());
  
  // Pool topics
  readonly poolStatus$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/pool/status'),
    map(m => m.payload as PoolStatus),
    catchError(() => of(null as any))
  );
  
  readonly temperatures$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/pool/temperatures'),
    map(m => m.payload as PoolTemperatures),
    catchError(() => of(null as any))
  );
  
  readonly chemistry$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/pool/chemistry'),
    map(m => m.payload as PoolChemistry),
    catchError(() => of(null as any))
  );
  
  // Devices
  readonly relays$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/devices/relays'),
    map(m => m.payload as RelayState[]),
    catchError(() => of([] as RelayState[]))
  );
  
  readonly inputs$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/devices/inputs'),
    map(m => m.payload as InputState[]),
    catchError(() => of([] as InputState[]))
  );
  
  // Alarms
  readonly alarmsActive$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/alarms/active'),
    map(m => m.payload as AlarmEntry[]),
    catchError(() => of([] as AlarmEntry[]))
  );
  
  readonly alarmsHistory$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/alarms/history'),
    map(m => m.payload as AlarmEntry[]),
    catchError(() => of([] as AlarmEntry[]))
  );
  
  // Logs
  readonly logsInfo$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/logs/info'),
    map(m => m.payload as LogEntry),
    catchError(() => of(null as any))
  );
  
  readonly logsWarn$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/logs/warn'),
    map(m => m.payload as LogEntry),
    catchError(() => of(null as any))
  );
  
  readonly logsError$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/logs/error'),
    map(m => m.payload as LogEntry),
    catchError(() => of(null as any))
  );
  
  // System
  readonly systemStatus$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/system/status'),
    map(m => m.payload as SystemStatus),
    catchError(() => of(null as any))
  );
  
  readonly systemUptime$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/system/uptime'),
    map(m => m.payload as { uptime: number }),
    catchError(() => of(null as any))
  );
  
  readonly systemMemory$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/system/memory'),
    map(m => m.payload as { free: number; total: number }),
    catchError(() => of(null as any))
  );
  
  readonly systemWifi$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/system/wifi'),
    map(m => m.payload as { rssi: number; ssid: string }),
    catchError(() => of(null as any))
  );
  
  readonly systemMqtt$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/system/mqtt'),
    map(m => m.payload as { connected: boolean; broker: string }),
    catchError(() => of(null as any))
  );
  
  connect(): void {
    const brokerUrl = environment.flowioBaseUrl.replace('http', 'ws').replace('https', 'wss');
    
    const options: MqttConnectionOptions = {
      host: brokerUrl.replace('ws://', '').replace('wss://', '').split('/')[0],
      port: 1883,
      protocol: 'ws',
      path: '/mqtt',
      clientId: `flowio-angular-${Math.random().toString(16).slice(3)}`,
      clean: true,
      reconnectPeriod: 3000,
      connectTimeout: 10000,
      username: 'flowio',
      password: 'flowio123'
    };
    
    this.client = new MqttClient(options);
    
    this.client.on('connect', () => {
      console.log('[MQTT] Connected');
      this.connectedSignal.set(true);
      this.subscribe();
    });
    
    this.client.on('error', (err) => {
      console.error('[MQTT] Error:', err);
      this.connectedSignal.set(false);
    });
    
    this.client.on('close', () => {
      console.log('[MQTT] Disconnected');
      this.connectedSignal.set(false);
    });
    
    this.client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        this.messagesSubject.next({ topic, payload });
      } catch (err) {
        console.error('[MQTT] Parse error:', err);
      }
    });
    
    this.destroyRef.onDestroy(() => this.disconnect());
  }
  
  private subscribe(): void {
    if (!this.client) return;
    
    const topics = [
      // Pool
      'flowio/pool/status',
      'flowio/pool/temperatures',
      'flowio/pool/chemistry',
      
      // Devices
      'flowio/devices/relays',
      'flowio/devices/inputs',
      'flowio/devices/sensors',
      
      // Alarms
      'flowio/alarms/active',
      'flowio/alarms/history',
      
      // Logs
      'flowio/logs/info',
      'flowio/logs/warn',
      'flowio/logs/error',
      
      // System
      'flowio/system/status',
      'flowio/system/uptime',
      'flowio/system/memory',
      'flowio/system/wifi',
      'flowio/system/mqtt',
      
      // Config
      'flowio/config/full',
      'flowio/config/modules/+'
    ];
    
    this.client.subscribe(topics, { qos: 1 }, (err) => {
      if (err) console.error('[MQTT] Subscribe error:', err);
      else console.log('[MQTT] Subscribed to', topics.length, 'topics');
    });
  }
  
  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = undefined;
      this.connectedSignal.set(false);
    }
  }
  
  publish(topic: string, payload: any, qos: 0 | 1 | 2 = 1): void {
    if (!this.client || !this.connectedSignal()) return;
    
    this.client.publish(topic, JSON.stringify(payload), { qos }, (err) => {
      if (err) console.error('[MQTT] Publish error:', err);
    });
  }
  
  // Commandes - Pool
  setFiltration(on: boolean): void {
    this.publish('flowio/cmd/pool/filtration', { on });
  }
  
  setChlorine(on: boolean): void {
    this.publish('flowio/cmd/pool/chlorine', { on });
  }
  
  setPhDosing(on: boolean): void {
    this.publish('flowio/cmd/pool/ph', { on });
  }
  
  // Commandes - Devices
  setRelay(relayId: number, on: boolean): void {
    this.publish(`flowio/cmd/relay/${relayId}`, { on });
  }
  
  // Commandes - Config
  updateConfig(config: any): void {
    this.publish('flowio/cmd/config/update', config);
  }
  
  // Commandes - System
  reboot(): void {
    this.publish('flowio/cmd/system/reboot', {});
  }
  
  acknowledgeAlarm(alarmId: string): void {
    this.publish('flowio/cmd/alarm/ack', { id: alarmId });
  }
}
