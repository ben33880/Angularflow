import { inject, Injectable, signal, Signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, share, retry, tap, catchError, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import type { PoolStatus, LogEntry, AlarmEntry } from '../models/flowio.models';

export interface WsMessage {
  type: 'pool_status' | 'log' | 'alarm' | 'heartbeat';
  data: PoolStatus | LogEntry | AlarmEntry | { timestamp: number };
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private wsSubject?: WebSocketSubject<WsMessage>;
  private readonly reconnectSubject = new Subject<void>();
  
  private readonly connectedSignal = signal(false);
  readonly connected: Signal<boolean> = this.connectedSignal.asReadonly();
  
  private readonly messagesSubject = new Subject<WsMessage>();
  readonly messages$: Observable<WsMessage> = this.messagesSubject.asObservable();
  
  private readonly wsUrl = environment.flowioBaseUrl.replace('http', 'ws') + '/ws';
  
  connect(): void {
    this.wsSubject = webSocket<WsMessage>(this.wsUrl);
    
    this.wsSubject
      .pipe(
        share(),
        retry({ delay: 3000 }),
        tap({
          connect: () => this.connectedSignal.set(true),
          error: () => this.connectedSignal.set(false)
        }),
        catchError(() => {
          this.connectedSignal.set(false);
          return of();
        })
      )
      .subscribe({
        next: (msg) => this.messagesSubject.next(msg),
        error: (err) => {
          console.error('WebSocket error:', err);
          this.connectedSignal.set(false);
          this.reconnectSubject.next();
        }
      });
  }
  
  disconnect(): void {
    if (this.wsSubject) {
      this.wsSubject.complete();
      this.wsSubject = undefined;
      this.connectedSignal.set(false);
    }
  }
  
  sendMessage(type: string, data: any): void {
    if (this.wsSubject && this.connectedSignal()) {
      this.wsSubject.next({ type, data });
    }
  }
}
