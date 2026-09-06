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
  outdoor: number;
}

export interface PoolChemistry {
  ph: number;
  orp: number;
}

export interface SystemStatus {
  uptime: number;
  freeMemory: number;
  totalMemory: number;
  wifiRssi: number;
  mqttConnected: boolean;
}

export interface SystemUptime {
  uptime: number;
}

export interface SystemMemory {
  free: number;
  total: number;
}

export interface SystemWifi {
  rssi: number;
  ssid: string;
}

export interface SystemMqtt {
  connected: boolean;
  broker: string;
}

export interface LogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  module: string;
}

export interface AlarmEntry {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  code: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface DeviceConfig {
  wifiSsid: string;
  wifiPassword: string;
  mqttEnabled: boolean;
  mqttBroker: string;
  mqttUsername: string;
  mqttPassword: string;
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
