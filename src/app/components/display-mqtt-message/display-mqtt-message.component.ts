import { Buffer } from 'buffer';
import mqtt from 'mqtt';
import { MqttClient } from 'mqtt/dist/mqtt';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

// src/app/display-mqtt-message/display-mqtt-message.component.ts
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  imports: [],
  templateUrl: './display-mqtt-message.component.html',
  styleUrls: ['./display-mqtt-message.component.css'],
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
      authenticationData: Buffer.from(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2V2ZW50Z3JpZC5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OGRiODQyMC1jMWU5LTRjYzQtYjVlNC00ZjRlMzI0NTlhN2QvIiwiaWF0IjoxNzEzODYyODYxLCJuYmYiOjE3MTM4NjI4NjEsImV4cCI6MTcxMzg2Njc2MSwiYWlvIjoiRTJOZ1lORGE1eC9EZXV2OFlrbi92SmdNemN1eUFBPT0iLCJhcHBpZCI6ImZmNzFiNDBlLWU3ODEtNGU5Yy1iNzE3LWEzYzUwYmVlZTRiNSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZC8iLCJvaWQiOiI3YWVkMGY1Yi1lZWExLTRlOWItYTI1Ni1mYjM5YTcwOGVlZTAiLCJyaCI6IjAuQVNzQUlJVGJpT25CeEV5MTVFOU9Na1dhZlhnS1BJTGdYVVZFcF9YQzlDMTl5SnZDQUFBLiIsInN1YiI6IjdhZWQwZjViLWVlYTEtNGU5Yi1hMjU2LWZiMzlhNzA4ZWVlMCIsInRpZCI6Ijg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZCIsInV0aSI6ImZ3eUpRREJtZ2thQkU3YmZQT2Q0QUEiLCJ2ZXIiOiIxLjAifQ.KPA5COjSZCg4SnoBOn9NrSXFuEaw4Z1WH3GKIvw73InwX_PqTMFeZ4T4DaMsGeVJv1dg3_6qERa9Q4dpBxlfvX7AMASCPXCkprPYxvz2pUrOlM_k5f6uEKLgJV69ufiNMACCCgm72QclXHekozzHiiYFuLdx4ddTjHn5IIle_-4LECqbQni7dAD4RO3kVmCtKBVzpd2kVxmyH7O7r7_8UE0oNFZyG3gKv12BXmv-WTkr90GUuGGaqa7-vPQj2WCvYiP5K3BUlF1vSu9vrl4MR_4ecURiIzLRqM8MUmOnG0B7dl700dIT2du7_izFDDWpr0tyjdadKe5PsMv9FsLFBA'
      ),
    },
  };
  public PUBLIC_HOST: any = {
    hostname: 'broker.hivemq.com',
    protocol: 'wss',
    port: 8884,
  };
  client?: MqttClient;

  constructor() {}
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
  }
  async connectMqtt() {
    try {
      this.client = await mqtt.connectAsync(this.PUBLIC_HOST);
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
