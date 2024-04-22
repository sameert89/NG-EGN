import { Buffer } from 'buffer';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
//   hostname: 'broker.hivemq.com',
//   port: 8000,
//   path: '/mqtt',
//   protocol: 'ws',
// };

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom()],
};
