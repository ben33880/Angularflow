export interface PoolStatus {
  temperature: number;
  ph: number;
  orp: number;
  filtrationOn: boolean;
  chlorineDosingOn: boolean;
  phDosingOn: boolean;
}

export interface PoolTemperatures {
  basin: number;
  return: number;
  equipment: number;
  outdoor?: number;
}

export interface PoolChemistry {
  ph: number;
  orp: number;
  redox?: number;
  tds?: number;
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

export interface SystemStatus {
  uptime: number;
  freeMemory: number;
  totalMemory: number;
  wifiRssi: number;
  mqttConnected: boolean;
}

export interface RelayState {
  id: number;
  name: string;
  on: boolean;
}

export interface InputState {
  id: number;
  name: string;
  active: boolean;
}
