import { Buffer } from 'buffer';
import mqtt from 'mqtt';
import { MqttClient } from 'mqtt/dist/mqtt';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
// src/app/display-mqtt-message/display-mqtt-message.component.ts
import { Component, importProvidersFrom, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  imports: [],
  templateUrl: './display-mqtt-message.component.html',
  styleUrls: ['./display-mqtt-message.component.css'],
  providers: [],
})
export class DisplayMqttMessageComponent {
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
      authenticationData: Buffer.from('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2V2ZW50Z3JpZC5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OGRiODQyMC1jMWU5LTRjYzQtYjVlNC00ZjRlMzI0NTlhN2QvIiwiaWF0IjoxNzEzOTMzNTA5LCJuYmYiOjE3MTM5MzM1MDksImV4cCI6MTcxMzkzNzQwOSwiYWlvIjoiRTJOZ1lDZ3F5dkgrSUp6ai82Q2hPN1NsMU40Q0FBPT0iLCJhcHBpZCI6ImZmNzFiNDBlLWU3ODEtNGU5Yy1iNzE3LWEzYzUwYmVlZTRiNSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZC8iLCJvaWQiOiI3YWVkMGY1Yi1lZWExLTRlOWItYTI1Ni1mYjM5YTcwOGVlZTAiLCJyaCI6IjAuQVNzQUlJVGJpT25CeEV5MTVFOU9Na1dhZlhnS1BJTGdYVVZFcF9YQzlDMTl5SnZDQUFBLiIsInN1YiI6IjdhZWQwZjViLWVlYTEtNGU5Yi1hMjU2LWZiMzlhNzA4ZWVlMCIsInRpZCI6Ijg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZCIsInV0aSI6IkdWR3RHbENvYlVHMGgxeXlSWVdhQUEiLCJ2ZXIiOiIxLjAifQ.gSh72ERThuXLjEJ38hXW4W3HguOqFJ-PyEpudNuoTarEbAkX5gkUQtm6_QH_dt1Yo1kNozEx_OVwKvtGWgGBcossw7lvS7SsgQeuRDAfEdOPOVJ4_xl8dC2wsGmjrKj9Ja607cacNlhXO-wcfEuAZ4Qg8EcGRW5gmugdm003_UWm4QpOMvILOywIaFQkx7UWXOQnZcGfhVYkbiWrM7bz6ziNJLfEJovStrFVjeZQlX5NuVGRuEkKw_tSqqmLEkhGCtXOptQz193tZCFhKSVyiXXxNfYqbdbZ8qCmy5gzFLNRpBLxfmeSZZ1JiM32JEchrrVuwvQdHeKHXYoKAJCgEA'),
    },
  };
  public PUBLIC_HOST: any = {
    hostname: 'broker.hivemq.com',
    protocol: 'wss',
    port: 8884,
  };
  client?: MqttClient;
  workerURL: SafeResourceUrl;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.workerURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://' + this.MQTT_SERVICE_OPTIONS.hostname + '/mqtt'
    );
    // certificate issue
    // this.http.get(`https://${this.MQTT_SERVICE_OPTIONS.hostname}/mqtt`);
  }
  ngOnInit() {
    // var ctx = window.open(`https://${this.MQTT_SERVICE_OPTIONS.hostname}/mqtt`);
    // ctx?.close();
  }
  async connectMqtt() {
    if (!this.MQTT_SERVICE_OPTIONS.properties.authenticationData) return;
    try {
      this.client = await mqtt.connectAsync(this.MQTT_SERVICE_OPTIONS);
      this.message = 'connected';
      this.client.subscribeAsync('angularmqttdemo/topic1');
      this.client.on('message', (topic, message) =>
        console.log(topic, message.toString())
      );
      console.log(this.client.connected);
    } catch (e) {
      console.log(e);
    }
  }
  async publishMsg() {
    this.client?.publishAsync('angularmqttdemo/topic1', 'Hello World');
  }
}
