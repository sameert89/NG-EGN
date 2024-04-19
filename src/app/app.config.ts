import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
  port: 443,
  username: 'client1-authn-ID',
  path: '/mqtt',
  protocol: 'ws',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),
  ],
};
