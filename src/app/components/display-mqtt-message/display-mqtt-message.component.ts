import { Buffer } from 'buffer';
import mqtt from 'mqtt';
import { MqttClient } from 'mqtt/dist/mqtt';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
// src/app/display-mqtt-message/display-mqtt-message.component.ts
import { Component, importProvidersFrom, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  imports: [],
  templateUrl: './display-mqtt-message.component.html',
  styleUrls: ['./display-mqtt-message.component.css'],
  providers: [],
})
export class DisplayMqttMessageComponent implements OnDestroy {
  private subscription?: Subscription;
  private connectionSubscription?: Subscription;
  public message: string = 'Not Connected';
  public MQTT_SERVICE_OPTIONS: any = {
    hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
    port: 443,
    path: '/mqtt',
    protocol: 'wss',
    username: 'angularapp',
    protocolVersion: 5,
    properties: {
      authenticationMethod: 'OAUTH2-JWT',
      authenticationData:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2V2ZW50Z3JpZC5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OGRiODQyMC1jMWU5LTRjYzQtYjVlNC00ZjRlMzI0NTlhN2QvIiwiaWF0IjoxNzEzODcxMzY1LCJuYmYiOjE3MTM4NzEzNjUsImV4cCI6MTcxMzg3NTI2NSwiYWlvIjoiRTJOZ1lQQXZuVk5nMUJKd3pDbGhheFhQMlkvL0FRPT0iLCJhcHBpZCI6ImZmNzFiNDBlLWU3ODEtNGU5Yy1iNzE3LWEzYzUwYmVlZTRiNSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZC8iLCJvaWQiOiI3YWVkMGY1Yi1lZWExLTRlOWItYTI1Ni1mYjM5YTcwOGVlZTAiLCJyaCI6IjAuQVNzQUlJVGJpT25CeEV5MTVFOU9Na1dhZlhnS1BJTGdYVVZFcF9YQzlDMTl5SnZDQUFBLiIsInN1YiI6IjdhZWQwZjViLWVlYTEtNGU5Yi1hMjU2LWZiMzlhNzA4ZWVlMCIsInRpZCI6Ijg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZCIsInV0aSI6ImVvazdlc29JckV5VTJwU1ROSGFKQUEiLCJ2ZXIiOiIxLjAifQ.RQY41LFE4bY0yot3nI_v6BIGAEdYhl7euCyHi9Po_F8xY20H60MQxF2HUUyVO1B1YDPUPOM_b56GM1dhzeOxdB1s7DW70clz0KCl0wy4rfxQtmENKLKZn57wrwZ3yYBxE0SfGCNLAl5ity3bPv9GAFokHAaAQcpzaJ6oTi-Z5cKcXXLU4MbCk7oj2KbcQrmUYe2Bq_hB7lUQ9laxYzpp8BfcHPcUoStPb-yihX57VxqygMBIvEf7uNSOkH7KQPjCfBhtTVCCS-TmV8BzDbBIyydLvptld1lKU48qMyIsZliD0VgLT2L-zYRLXM7fr1n94fw2eJ2340ys0oJamm8CWw',
    },
  };
  public PUBLIC_HOST: any = {
    hostname: 'broker.hivemq.com',
    protocol: 'wss',
    port: 8884,
  };
  client?: MqttClient;
  constructor(private http: HttpClient) {
    // http
    //   .post(
    //     'https://login.microsoftonline.com/88db8420-c1e9-4cc4-b5e4-4f4e32459a7d/oauth2/v2.0/token',
    //     {
    //       client_id: 'ff71b40e-e781-4e9c-b717-a3c50beee4b5',
    //       client_secret: 'byI8Q~BOk8_UEQyuPGJHQqQG29G4vjcubtZGvc3V',
    //       scope: 'https://eventgrid.azure.net/.default',
    //       grant_type: 'client_credentials',
    //     }
    //   )
    //   .subscribe({
    //     next: (response: any) => {
    //       console.log(response);
    //       this.MQTT_SERVICE_OPTIONS.properties.authenticationData = Buffer.from(
    //         response.access_token
    //       );
    //     },
    //   });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
  }
  async connectMqtt() {
    if (!this.MQTT_SERVICE_OPTIONS.properties.authenticationData) return;
    try {
      this.client = await mqtt.connectAsync(this.MQTT_SERVICE_OPTIONS);
      this.message = 'connected';
      console.log(this.client.connected);
    } catch (e) {
      console.log(e);
    }
  }
  async publishMsg() {
    this.client?.publishAsync('angularmqttdemo/topic1', 'Hello World');
  }
}
