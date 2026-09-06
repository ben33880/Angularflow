// MQTT.js browser typings
declare module 'mqtt' {
  export interface IClientOptions {
    clientId?: string;
    clean?: boolean;
    reconnectPeriod?: number;
    connectTimeout?: number;
    username?: string;
    password?: string;
  }

  export interface MqttClient {
    on(event: 'connect', listener: () => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
    on(event: 'message', listener: (topic: string, message: Buffer) => void): this;
    on(event: 'reconnect', listener: () => void): this;
    on(event: 'offline', listener: () => void): this;

    subscribe(topic: string | string[], options: any, callback?: (err: Error | null) => void): this;
    publish(topic: string, message: string, options: any, callback?: (err: Error | null) => void): this;
    end(force?: boolean): this;
  }

  export function MqttClient(url: string, options?: IClientOptions): MqttClient;
  export { MqttClient as Client };
}
