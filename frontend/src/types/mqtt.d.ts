declare module 'mqtt' {
  import { EventEmitter } from 'events';

  export interface IClientOptions {
    clientId?: string;
    username?: string;
    password?: string;
    clean?: boolean;
    reconnectPeriod?: number;
    connectTimeout?: number;
  }

  export interface MqttClient extends EventEmitter {
    on(event: 'connect', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'offline', listener: () => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'message', listener: (topic: string, payload: Buffer) => void): this;
    on(event: 'reconnect', listener: () => void): this;
    on(event: 'end', listener: () => void): this;

    subscribe(topic: string | string[], opts: any, callback?: (err: Error | null, granted?: any) => void): MqttClient;
    publish(topic: string, message: string | Buffer, opts: any, callback?: (err: Error | null) => void): MqttClient;
    end(force?: boolean, opts?: any, callback?: () => void): MqttClient;
  }

  export function MqttClient(streamBuilder: string, options: IClientOptions): MqttClient;
  export { MqttClient as Client };
}
