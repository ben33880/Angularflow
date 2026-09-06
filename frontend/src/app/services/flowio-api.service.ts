import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import type { AlarmEntry, DeviceConfig, LogEntry, PoolStatus } from '../models/flowio.models';

@Injectable({ providedIn: 'root' })
export class FlowioApiService {
	private readonly http = inject(HttpClient);

	healthCheck(): Observable<boolean> {
		return this.http.get<boolean>('/api/health');
	}

	getAlarms(): Observable<AlarmEntry[]> {
		return this.http.get<AlarmEntry[]>('/api/alarms');
	}

	acknowledgeAlarm(id: string): Observable<void> {
		return this.http.post<void>(`/api/alarms/${id}/acknowledge`, {});
	}

	getConfig(): Observable<DeviceConfig> {
		return this.http.get<DeviceConfig>('/api/config');
	}

	updateConfig(config: DeviceConfig): Observable<void> {
		return this.http.put<void>('/api/config', config);
	}

	getLogs(): Observable<LogEntry[]> {
		return this.http.get<LogEntry[]>('/api/logs');
	}

	getPoolStatus(): Observable<PoolStatus> {
		return this.http.get<PoolStatus>('/api/pool/status');
	}

	setFiltration(on: boolean): Observable<void> {
		return this.http.post<void>('/api/pool/filtration', { on });
	}

	setChlorineDosing(on: boolean): Observable<void> {
		return this.http.post<void>('/api/pool/chlorine', { on });
	}

	setPhDosing(on: boolean): Observable<void> {
		return this.http.post<void>('/api/pool/ph', { on });
	}
}
