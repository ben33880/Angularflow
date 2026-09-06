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
        temperature: 27.5 + Math.random() * 0.5,
        ph: 7.2 + Math.random() * 0.3 - 0.15,
        orp: 680 + Math.random() * 40 - 20,
        filtrationOn: true,
        chlorineDosingOn: false,
        phDosingOn: false
      });
    }, 2000));

    // Temperatures - update every 3s
    this.intervals.push(setInterval(() => {
      this.temperaturesSignal.set({
        basin: 27.5 + Math.random() * 0.5,
        return: 28.0 + Math.random() * 0.5,
        equipment: 32.0 + Math.random() * 1,
        outdoor: 25.0 + Math.random() * 3
      });
    }, 3000));

    // Chemistry - update every 2s
    this.intervals.push(setInterval(() => {
      this.chemistrySignal.set({
        ph: 7.2 + Math.random() * 0.3 - 0.15,
        orp: 680 + Math.random() * 40 - 20,
        redox: 680 + Math.random() * 40,
        tds: 500 + Math.random() * 50
      });
    }, 2000));

    // System status - update every 5s
    this.intervals.push(setInterval(() => {
      this.systemStatusSignal.set({
        uptime: Math.floor(Date.now() / 1000),
        freeMemory: 150000 + Math.floor(Math.random() * 10000),
        totalMemory: 200000,
        wifiRssi: -45 + Math.floor(Math.random() * 10),
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
        free: 150000 + Math.floor(Math.random() * 10000),
        total: 200000
      });
    }, 10000));

    // WiFi - update every 10s
    this.intervals.push(setInterval(() => {
      this.systemWifiSignal.set({
        rssi: -45 + Math.floor(Math.random() * 10),
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

    // Logs - occasional
    this.intervals.push(setInterval(() => {
      const messages = [
        'Filtration cycle started',
        'Temperature stable',
        'pH within range',
        'ORP sensor reading normal',
        'System health check passed'
      ];
      this.logsInfoSignal.set({
        timestamp: Date.now(),
        level: 'INFO',
        message: messages[Math.floor(Math.random() * messages.length)],
        module: 'PoolController'
      });
    }, 8000));

    // Alarms - occasional
    this.intervals.push(setInterval(() => {
      if (Math.random() > 0.7) {
        this.alarmsActiveSignal.set([
          {
            id: 'alarm-1',
            severity: 'LOW',
            code: 'TEMP_HIGH',
            message: 'Temperature slightly above target',
            timestamp: Date.now(),
            acknowledged: false
          }
        ]);
      }
    }, 15000));
  }

  // Mock commands
  setFiltration(on: boolean): void {
    const status = this.poolStatusSignal();
    if (status) {
      this.poolStatusSignal.set({ ...status, filtrationOn: on });
    }
  }

  setChlorine(on: boolean): void {
    const status = this.poolStatusSignal();
    if (status) {
      this.poolStatusSignal.set({ ...status, chlorineDosingOn: on });
    }
  }

  setPhDosing(on: boolean): void {
    const status = this.poolStatusSignal();
    if (status) {
      this.poolStatusSignal.set({ ...status, phDosingOn: on });
    }
  }

  setRelay(id: number, on: boolean): void {
    // Mock relay toggle
  }

  updateConfig(config: DeviceConfig): void {
    // Mock config update
  }

  reboot(): void {
    // Mock reboot
    setTimeout(() => this.connect(), 2000);
  }

  acknowledgeAlarm(id: string): void {
    this.alarmsActiveSignal.set([]);
  }
}
