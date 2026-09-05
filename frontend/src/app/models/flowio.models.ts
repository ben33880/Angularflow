export interface PoolStatus {
  temperature: number;
  ph: number;
  orp: number;
  filtrationOn: boolean;
  chlorineDosingOn: boolean;
  phDosingOn: boolean;
}

export interface DeviceConfig {
  wifiSsid: string;
  wifiPassword?: string;
  mqttEnabled: boolean;
  mqttBroker: string;
  mqttUsername?: string;
  mqttPassword?: string;
}

export interface LogEntry {
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  module?: string;
}

export interface AlarmEntry {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  code: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}
