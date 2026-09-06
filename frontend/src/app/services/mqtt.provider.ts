import { Provider } from '@angular/core';
import { MqttService } from './mqtt.service';
import { MockMqttService } from './mock-mqtt.service';
import { environment } from '../../environments/environment';

export const mqttServiceProvider: Provider = {
  provide: MqttService,
  useFactory: () => {
    if (!environment.production) {
      return new MockMqttService();
    }
    return new MqttService();
  },
  deps: []
};
