import { Injectable, signal } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly logsSignal = signal<LogEntry[]>([]);
  readonly logs = this.logsSignal.asReadonly();
  
  private enabled = true;
  private minLevel: LogLevel = 'info';

  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor() {
    // Auto-disable logs in production
    this.enabled = !this.isProduction();
  }

  debug(message: string, context?: string): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: string): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: string): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: string): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: string): void {
    if (!this.enabled || this.levels[level] < this.levels[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context
    };

    this.logsSignal.update(logs => [entry, ...logs].slice(0, 100));

    // Still log to console in dev for debugging
    if (!this.isProduction()) {
      const prefix = context ? `[${context}]` : '[App]';
      const color = this.getColor(level);
      console.log(`${prefix} ${color}${level.toUpperCase()}${this.reset()}: ${message}`);
    }
  }

  private getColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m'  // Red
    };
    return colors[level];
  }

  private reset(): string {
    return '\x1b[0m';
  }

  private isProduction(): boolean {
    return typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  }

  clear(): void {
    this.logsSignal.set([]);
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}
