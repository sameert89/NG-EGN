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
    },
  };
  public PUBLIC_HOST: any = {
    hostname: 'broker.hivemq.com',
    protocol: 'wss',
    port: 8884,
  };
  client?: MqttClient;
  constructor(private http: HttpClient) {
    http
      .post(
        'https://login.microsoftonline.com/88db8420-c1e9-4cc4-b5e4-4f4e32459a7d/oauth2/v2.0/token',
        {
          client_id: 'ff71b40e-e781-4e9c-b717-a3c50beee4b5',
          client_secret: 'byI8Q~BOk8_UEQyuPGJHQqQG29G4vjcubtZGvc3V',
          scope: 'https://eventgrid.azure.net/.default',
          grant_type: 'client_credentials',
        }
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.MQTT_SERVICE_OPTIONS.properties.authenticationData = Buffer.from(
            response.access_token
          );
        },
      });
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
