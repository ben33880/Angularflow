import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { PoolStatus, DeviceConfig, LogEntry, AlarmEntry } from '../models/flowio.models';

@Injectable({ providedIn: 'root' })
export class FlowioApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.flowioBaseUrl;

  getPoolStatus(): Observable<PoolStatus> {
    return this.http.get<PoolStatus>(`${this.baseUrl}/api/pool/status`);
  }

  setFiltration(on: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/pool/filtration`, { on });
  }

  setChlorineDosing(on: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/pool/chlorine`, { on });
  }

  setPhDosing(on: boolean): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/pool/ph`, { on });
  }

  getConfig(): Observable<DeviceConfig> {
    return this.http.get<DeviceConfig>(`${this.baseUrl}/api/device/config`);
  }

  updateConfig(config: DeviceConfig): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/device/config`, config);
  }

  getLogs(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(`${this.baseUrl}/api/logs`);
  }

  getAlarms(): Observable<AlarmEntry[]> {
    return this.http.get<AlarmEntry[]>(`${this.baseUrl}/api/alarms`);
  }

  acknowledgeAlarm(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/alarms/${id}/ack`, {});
  }

  healthCheck(): Observable<{ status: string; uptime: number }> {
    return this.http.get<{ status: string; uptime: number }>(`${this.baseUrl}/api/health`);
  }
}
