import { Injectable, signal, computed } from '@angular/core';
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
export class MockMqttService {
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
  readonly alarmsActive$ = this.alarmsActiveSignal.asReadonly();

  private readonly configSignal = signal<DeviceConfig | null>(null);
  readonly config$ = this.configSignal.asReadonly();

  private readonly relaysSignal = signal<RelayState[]>([]);
  private readonly inputsSignal = signal<InputState[]>([]);
  
  readonly relays$ = this.relaysSignal.asReadonly();
  readonly inputs$ = this.inputsSignal.asReadonly();

  private intervals: number[] = [];

  connect(): void {
    this.connectedSignal.set(true);
    this.startSimulation();
  }

  disconnect(): void {
    this.connectedSignal.set(false);
    this.intervals.forEach(id => clearInterval(id));
    this.intervals = [];
  }

  private startSimulation(): void {
    // Pool status - update every 2s
    this.intervals.push(setInterval(() => {
      this.poolStatusSignal.set({
        temperature: 27 + Math.random() * 2,
        ph: 7.2 + Math.random() * 0.4,
        orp: 680 + Math.random() * 40,
        filtrationOn: true,
        chlorineDosingOn: false,
        phDosingOn: false
      });
    }, 2000));

    // Temperatures - update every 3s
    this.intervals.push(setInterval(() => {
      this.temperaturesSignal.set({
        basin: 27.5 + Math.random(),
        return: 26 + Math.random(),
        equipment: 25 + Math.random(),
        outdoor: 22 + Math.random() * 5
      });
    }, 3000));

    // Chemistry - update every 2s
    this.intervals.push(setInterval(() => {
      this.chemistrySignal.set({
        ph: 7.3 + Math.random() * 0.3,
        orp: 690 + Math.random() * 30
      });
    }, 2000));

    // System status - update every 5s
    this.intervals.push(setInterval(() => {
      this.systemStatusSignal.set({
        uptime: Math.floor(Date.now() / 1000),
        freeMemory: 150000 + Math.floor(Math.random() * 50000),
        totalMemory: 200000,
        wifiRssi: -45 - Math.floor(Math.random() * 20),
        mqttConnected: true
      });
    }, 5000));

    // Uptime - update every 10s
    this.intervals.push(setInterval(() => {
      this.systemUptimeSignal.set({
        uptime: Math.floor(Date.now() / 1000)
      });
    }, 10000));

    // Memory - update every 10s
    this.intervals.push(setInterval(() => {
      this.systemMemorySignal.set({
        free: 150000 + Math.floor(Math.random() * 50000),
        total: 200000
      });
    }, 10000));

    // WiFi - update every 10s
    this.intervals.push(setInterval(() => {
      this.systemWifiSignal.set({
        rssi: -45 - Math.floor(Math.random() * 20),
        ssid: 'PoolWiFi'
      });
    }, 10000));

    // MQTT status - update every 10s
    this.intervals.push(setInterval(() => {
      this.systemMqttSignal.set({
        connected: true,
        broker: 'localhost:1883'
      });
    }, 10000));

    // Logs - random every 5-15s
    this.intervals.push(setInterval(() => {
      const level = Math.random() > 0.8 ? 'warn' : Math.random() > 0.9 ? 'error' : 'info';
      const messages = {
        info: ['System check completed', 'Pool status updated', 'Sensors reading normal'],
        warn: ['Temperature fluctuation detected', 'pH slightly high'],
        error: ['Sensor timeout', 'Connection retry']
      };
      const msg = messages[level][Math.floor(Math.random() * messages[level].length)];
      
      const log: LogEntry = {
        timestamp: Date.now(),
        level: level as any,
        message: msg,
        module: 'system'
      };

      if (level === 'info') this.logsInfoSignal.set(log);
      else if (level === 'warn') this.logsWarnSignal.set(log);
      else this.logsErrorSignal.set(log);
    }, 5000 + Math.random() * 10000));

    // Alarms - random every 20-60s
    this.intervals.push(setInterval(() => {
      if (Math.random() > 0.7) {
        const severities = ['LOW', 'MEDIUM', 'HIGH'] as const;
        const codes = ['TEMP_HIGH', 'PH_LOW', 'ORP_LOW', 'FLOW_ERROR'];
        
        const alarm: AlarmEntry = {
          id: Math.random().toString(36).slice(2),
          severity: severities[Math.floor(Math.random() * severities.length)],
          code: codes[Math.floor(Math.random() * codes.length)],
          message: 'Alarm triggered',
          timestamp: Date.now(),
          acknowledged: false
        };

        this.alarmsActiveSignal.set([alarm]);
      }
    }, 20000 + Math.random() * 40000));

    // Config - once
    this.configSignal.set({
      wifiSsid: 'PoolWiFi',
      wifiPassword: 'pool1234',
      mqttEnabled: true,
      mqttBroker: 'localhost',
      mqttUsername: '',
      mqttPassword: ''
    });

    // Relays - once
    this.relaysSignal.set([
      { id: 1, name: 'Filtration', on: true },
      { id: 2, name: 'Chlorine', on: false },
      { id: 3, name: 'pH', on: false },
      { id: 4, name: 'Heater', on: false },
      { id: 5, name: 'Light', on: false },
      { id: 6, name: 'Pump 1', on: false },
      { id: 7, name: 'Pump 2', on: false },
      { id: 8, name: 'Aux', on: false }
    ]);

    // Inputs - once
    this.inputsSignal.set([
      { id: 1, name: 'Flow Sensor', active: true },
      { id: 2, name: 'Pressure', active: true },
      { id: 3, name: 'Level', active: true },
      { id: 4, name: 'Temp Probe', active: true }
    ]);
  }

  // Commands (mock)
  setFiltration(on: boolean): void {
    this.poolStatusSignal.update(s => s ? { ...s, filtrationOn: on } : null);
  }

  setChlorine(on: boolean): void {
    this.poolStatusSignal.update(s => s ? { ...s, chlorineDosingOn: on } : null);
  }

  setPhDosing(on: boolean): void {
    this.poolStatusSignal.update(s => s ? { ...s, phDosingOn: on } : null);
  }

  setRelay(id: number, on: boolean): void {
    this.relaysSignal.update(relays => 
      relays.map(r => r.id === id ? { ...r, on } : r)
    );
  }

  updateConfig(config: DeviceConfig): void {
    this.configSignal.set(config);
  }

  reboot(): void {
    // Mock reboot
    setTimeout(() => this.connect(), 3000);
  }

  acknowledgeAlarm(id: string): void {
    this.alarmsActiveSignal.update(alarms => 
      alarms.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    );
  }
}
