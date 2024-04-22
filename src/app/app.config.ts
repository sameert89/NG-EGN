import { Buffer } from 'buffer';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
  port: 443,
  path: '/mqtt',
  protocol: 'wss',
  username: 'angularapp',
  protocolVersion: 5,
  properties: {
    authenticationMethod: 'OAUTH2-JWT',
    authenticationData: Buffer.from(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2V2ZW50Z3JpZC5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OGRiODQyMC1jMWU5LTRjYzQtYjVlNC00ZjRlMzI0NTlhN2QvIiwiaWF0IjoxNzEzNzc3NTI5LCJuYmYiOjE3MTM3Nzc1MjksImV4cCI6MTcxMzc4MTQyOSwiYWlvIjoiRTJOZ1lFZzA1dzc2UHMrMllqWmZVYzMxdlpJckFBPT0iLCJhcHBpZCI6ImZmNzFiNDBlLWU3ODEtNGU5Yy1iNzE3LWEzYzUwYmVlZTRiNSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZC8iLCJvaWQiOiI3YWVkMGY1Yi1lZWExLTRlOWItYTI1Ni1mYjM5YTcwOGVlZTAiLCJyaCI6IjAuQVNzQUlJVGJpT25CeEV5MTVFOU9Na1dhZlhnS1BJTGdYVVZFcF9YQzlDMTl5SnZDQUFBLiIsInN1YiI6IjdhZWQwZjViLWVlYTEtNGU5Yi1hMjU2LWZiMzlhNzA4ZWVlMCIsInRpZCI6Ijg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZCIsInV0aSI6IlVsSVpoQWk2TVVPS1RVMFY4LUJlQUEiLCJ2ZXIiOiIxLjAifQ.YA0vhdg6SalDBTx7A7zDXoWlbBaXgP13Hfuxw-h_wPx1NjwNsHMumEhCeKd04_wm1S2q_AX4RT2mmmJNAPldLspWGsWOiHyyzrp0l7BwhG0_kV4KhoyACUjFJoKgRA8B3da1jy4IC8UXJYobloCxxXECu4wWEkOMaH0Jtl5Y3j-oJtU_iIl3dplS2xc9Jlw5MDGaOZOGZ_ni7-S9gQmBLyfVJ5IV_kh9TSyCvLmvwhfgj7WXPxB58x9E_sljnf-tp9UJCu6iaOFIR4uAWPdNYQ130Q5DMHlm2rSzQ-ZHQWlQtJ8iXWy2p-U-jkSzOU5KCGLmH0wXgAOPki54bSiWAQ'
    ),
  },
};
// export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
//   hostname: 'broker.hivemq.com',
//   port: 8000,
//   path: '/mqtt',
//   protocol: 'ws',
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS)),
  ],
};
