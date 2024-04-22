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
  public message: string = '';
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
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSIsImtpZCI6InEtMjNmYWxldlpoaEQzaG05Q1Fia1A1TVF5VSJ9.eyJhdWQiOiJodHRwczovL2V2ZW50Z3JpZC5henVyZS5uZXQiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84OGRiODQyMC1jMWU5LTRjYzQtYjVlNC00ZjRlMzI0NTlhN2QvIiwiaWF0IjoxNzEzODA3MzE1LCJuYmYiOjE3MTM4MDczMTUsImV4cCI6MTcxMzgxMTIxNSwiYWlvIjoiRTJOZ1lMZ1VXeHRsL3lqNjdlRWUzaDkvUHVYRkFRQT0iLCJhcHBpZCI6ImZmNzFiNDBlLWU3ODEtNGU5Yy1iNzE3LWEzYzUwYmVlZTRiNSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZC8iLCJvaWQiOiI3YWVkMGY1Yi1lZWExLTRlOWItYTI1Ni1mYjM5YTcwOGVlZTAiLCJyaCI6IjAuQVNzQUlJVGJpT25CeEV5MTVFOU9Na1dhZlhnS1BJTGdYVVZFcF9YQzlDMTl5SnZDQUFBLiIsInN1YiI6IjdhZWQwZjViLWVlYTEtNGU5Yi1hMjU2LWZiMzlhNzA4ZWVlMCIsInRpZCI6Ijg4ZGI4NDIwLWMxZTktNGNjNC1iNWU0LTRmNGUzMjQ1OWE3ZCIsInV0aSI6InBTNERGaF83NUVHcVRwb1RCbk5YQUEiLCJ2ZXIiOiIxLjAifQ.o2okbzBjQzqbKzPSrNwG6RjJJjHW3Q0YfMhYQmoMSXZLMIo3tlFpEMw0LHPG3ZUM6E_3Ob-e-j-D-IEt_KFEkPBxfAElUWP5F5Y5JGBjBYZ51eHdf2CR-HRhK_QBNRC0-MsaUYs9nZlKPF33sxYLzbEPQYLv0icWat1HJpg6HbXG7w9aTtlIvk3etoj2qAF5cO4ZDyi3YGB8R6kk_iiVvb-VEO9byZrdUAj8ToreodM6hlYAtFKO1DcYKsxrV6mOfJwE0yW-sUNSik24G11RGiq0eClvyNqh95dUvgyUux4tdawK1lgmRCmpM9jC9InzDBDDqaHgeTzR3-mDa_LKUw'
      ),
    },
  };
  client?: MqttClient;

  constructor() {}
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
  }
  async connectMqtt() {
    this.client = await mqtt.connectAsync(this.MQTT_SERVICE_OPTIONS);
    console.log(this.client.connected);
  }
  async publishMsg() {
    this.client?.publishAsync('angularmqttdemo/topic1', 'Hello World');
  }
}
