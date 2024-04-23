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
export class DisplayMqttMessageComponent{
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
      authenticationData: Buffer.from('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2V2ZW50Z3JpZC5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OGRiODQyMC1jMWU5LTRjYzQtYjVlNC00ZjRlMzI0NTlhN2QvIiwiaWF0IjoxNzEzODkyMDUxLCJuYmYiOjE3MTM4OTIwNTEsImV4cCI6MTcxMzg5NTk1MSwiYWlvIjoiRTJOZ1lOaTN2NjkvZS9qTWxhS3pOOFowZkFnVEJBQT0iLCJhcHBpZCI6ImZmNzFiNDBlLWU3ODEtNGU5Yy1iNzE3LWEzYzUwYmVlZTRiNSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZC8iLCJvaWQiOiI3YWVkMGY1Yi1lZWExLTRlOWItYTI1Ni1mYjM5YTcwOGVlZTAiLCJyaCI6IjAuQVNzQUlJVGJpT25CeEV5MTVFOU9Na1dhZlhnS1BJTGdYVVZFcF9YQzlDMTl5SnZDQUFBLiIsInN1YiI6IjdhZWQwZjViLWVlYTEtNGU5Yi1hMjU2LWZiMzlhNzA4ZWVlMCIsInRpZCI6Ijg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZCIsInV0aSI6Ik9OQmRjdjcxREVPamlrNGoxRHh0QUEiLCJ2ZXIiOiIxLjAifQ.3ekJorTvz2ErRmQW-NuAZNLDQtEqqp61eetH921tI1DUZtBpjPIr7lLiD7vaLbpX888PEp4RF4_0m_H2EEtRLkiBDHEVLO_ChVlB-2lxXqqZSJgvVL6lfDv1XpoVu_DSosI_0shflDoqtf3AMmPF13MkwuZU2P4n4CVL7wNzlkUzf4Fza5_IBVqcyG71rmybY5YUWRDAi2x3Xz-rG-MHHdM1nhYl9v60mu6UyUhGcpDLg05zjpu4Z5J_Vn4tnWtyNVnmzTUWbpOy4iDN0Z8aBIryK2z_eR75EHg_VYOVPmeTVNFNm-An0vFGKmDivfYTn3q8KuAAtoF-HoK2eluRMg')
    }
  };
  public PUBLIC_HOST: any = {
    hostname: 'broker.hivemq.com',
    protocol: 'wss',
    port: 8884,
  };
  client?: MqttClient;
  constructor(private http: HttpClient) {
    // certificate issue
    this.http.get(`https://${this.MQTT_SERVICE_OPTIONS.hostname}/mqtt`);
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
