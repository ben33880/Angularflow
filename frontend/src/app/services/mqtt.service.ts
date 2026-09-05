import { Injectable, signal, Signal, DestroyRef, inject } from '@angular/core';
import { MqttClient, MqttConnectionOptions } from 'mqtt';
import { Observable, Subject, share, filter, map } from 'rxjs';
import { environment } from '../../environments/environment';

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
  
  // Topics
  readonly poolStatus$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/pool/status'),
    map(m => m.payload)
  );
  
  readonly temperatures$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/pool/temperatures'),
    map(m => m.payload)
  );
  
  readonly chemistry$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/pool/chemistry'),
    map(m => m.payload)
  );
  
  readonly relays$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/devices/relays'),
    map(m => m.payload)
  );
  
  readonly alarms$ = this.messages$.pipe(
    filter(m => m.topic === 'flowio/alarms/active'),
    map(m => m.payload)
  );
  
  readonly logs$ = this.messages$.pipe(
    filter(m => m.topic.startsWith('flowio/logs/')),
    map(m => m.payload)
  );
  
  readonly system$ = this.messages$.pipe(
    filter(m => m.topic.startsWith('flowio/system/')),
    map(m => m.payload)
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
      'flowio/pool/status',
      'flowio/pool/temperatures',
      'flowio/pool/chemistry',
      'flowio/devices/relays',
      'flowio/devices/inputs',
      'flowio/alarms/active',
      'flowio/logs/+',
      'flowio/system/+'
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
  
  // Commandes
  setFiltration(on: boolean): void {
    this.publish('flowio/cmd/pool/filtration', { on });
  }
  
  setChlorine(on: boolean): void {
    this.publish('flowio/cmd/pool/chlorine', { on });
  }
  
  setPhDosing(on: boolean): void {
    this.publish('flowio/cmd/pool/ph', { on });
  }
  
  setRelay(relayId: number, on: boolean): void {
    this.publish(`flowio/cmd/relay/${relayId}`, { on });
  }
  
  updateConfig(config: any): void {
    this.publish('flowio/cmd/config/update', config);
  }
  
  reboot(): void {
    this.publish('flowio/cmd/system/reboot', {});
  }
}
