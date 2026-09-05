import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable, Subject, share, filter, takeWhile, retryWhen, delayWhen, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import type { PoolStatus, LogEntry, AlarmEntry } from '../models/flowio.models';

export interface WsMessage {
  type: 'pool_status' | 'log' | 'alarm' | 'heartbeat';
  data: PoolStatus | LogEntry | AlarmEntry | { timestamp: number };
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private wsSubject$?: WebSocketSubject<WsMessage>;
  private readonly messagesSubject = new Subject<WsMessage>();
  private isConnectedSignal = signal(false);
  private lastMessageSignal = signal<WsMessage | null>(null);

  readonly isConnected = computed(() => this.isConnectedSignal());
  readonly lastMessage = computed(() => this.lastMessageSignal());

  connect(): Observable<WsMessage> {
    const wsUrl = environment.flowioBaseUrl.replace('http', 'ws') + '/ws';

    this.wsSubject$ = webSocket<WsMessage>({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.isConnectedSignal.set(true);
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket disconnected');
          this.isConnectedSignal.set(false);
        }
      }
    });

    return this.wsSubject$.pipe(
      share(),
      retryWhen(errors =>
        errors.pipe(
          delayWhen(() => timer(3000)),
          takeWhile(() => true)
        )
      ),
      filter(msg => {
        this.lastMessageSignal.set(msg);
        return true;
      })
    );
  }

  getPoolStatusUpdates(): Observable<PoolStatus> {
    return this.connect().pipe(
      filter(msg => msg.type === 'pool_status'),
      map(msg => msg.data as PoolStatus)
    );
  }

  getLogUpdates(): Observable<LogEntry> {
    return this.connect().pipe(
      filter(msg => msg.type === 'log'),
      map(msg => msg.data as LogEntry)
    );
  }

  getAlarmUpdates(): Observable<AlarmEntry> {
    return this.connect().pipe(
      filter(msg => msg.type === 'alarm'),
      map(msg => msg.data as AlarmEntry)
    );
  }

  disconnect(): void {
    if (this.wsSubject$) {
      this.wsSubject$.complete();
      this.isConnectedSignal.set(false);
    }
  }
}

import { map } from 'rxjs/operators';
