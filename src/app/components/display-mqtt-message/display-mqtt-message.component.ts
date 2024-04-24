import { Buffer } from 'buffer';
import mqtt, { IClientOptions } from 'mqtt';
import { MqttClient } from 'mqtt/dist/mqtt';

import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { JWT } from '../../app.config';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  templateUrl: './display-mqtt-message.component.html',
  styleUrls: ['./display-mqtt-message.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    DatePipe,
    FormsModule,
    NgIf,
    NgFor,
    MatButtonModule,
  ],
})
export class DisplayMqttMessageComponent {
  public message: string = 'Not Connected';
  public userMessage: string = '';
  public receivedMessages: Array<{
    topic: string;
    content: string;
    timestamp: Date;
  }> = [];
  public MQTT_SERVICE_OPTIONS: IClientOptions = {
    hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
    port: 443,
    path: '/mqtt',
    protocol: 'wss',
    username: '',
    protocolVersion: 5,
    properties: {
      authenticationMethod: 'OAUTH2-JWT',
      authenticationData: Buffer.from(JWT),
    },
  };
  client?: MqttClient;
  workerURL: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.workerURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://' + this.MQTT_SERVICE_OPTIONS.hostname + '/mqtt'
    );
    this.MQTT_SERVICE_OPTIONS.username = this.generateRandomString(6);
    console.log(this.MQTT_SERVICE_OPTIONS.username);
  }

  async connectMqtt() {
    if (!this.MQTT_SERVICE_OPTIONS.properties?.authenticationData) return;
    try {
      this.client = await mqtt.connectAsync(this.MQTT_SERVICE_OPTIONS);
      this.message = 'Connected';
      this.client.subscribeAsync('angularmqttdemo/topic1');
      this.client.on('message', (topic, message) => {
        this.receivedMessages.push({
          topic: topic,
          content: message.toString(),
          timestamp: new Date(),
        });
      });
      console.log(this.client.connected);
    } catch (e) {
      console.log(e);
    }
  }

  async publishMsg() {
    if (this.userMessage.trim()) {
      this.client?.publishAsync('angularmqttdemo/topic1', this.userMessage);
      this.userMessage = ''; // Reset message input
    }
  }

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'MyoConsult-';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
}
