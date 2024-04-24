import { Buffer } from 'buffer';
import mqtt, { IClientOptions, StreamBuilder } from 'mqtt';
import { MqttClient } from 'mqtt/dist/mqtt';

import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { JWT } from '../../app.config';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  templateUrl: './display-mqtt-message.component.html',
  styleUrls: ['./display-mqtt-message.component.css'],
})
export class DisplayMqttMessageComponent {
  public message: string = 'Not Connected';
  public MQTT_SERVICE_OPTIONS: IClientOptions = {
    hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
    port: 443,
    path: '/mqtt',
    protocol: 'wss',
    username: 'angularapp',
    protocolVersion: 5,
    properties: {
      authenticationMethod: 'OAUTH2-JWT',
      authenticationData: Buffer.from(JWT),
    },
  };
  public PUBLIC_HOST: any = {
    hostname: 'broker.hivemq.com',
    protocol: 'wss',
    port: 8884,
  };
  client?: MqttClient;
  workerURL: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    this.workerURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://' + this.MQTT_SERVICE_OPTIONS.hostname + '/mqtt'
    );
  }
  async connectMqtt() {
    if (!this.MQTT_SERVICE_OPTIONS.properties?.authenticationData) return;
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
