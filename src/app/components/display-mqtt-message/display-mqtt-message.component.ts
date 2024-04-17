import * as mqtt from 'mqtt/dist/mqtt';

import { Component } from '@angular/core';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  imports: [],
  templateUrl: './display-mqtt-message.component.html',
  styleUrl: './display-mqtt-message.component.css',
})
export class DisplayMqttMessageComponent {
  options: any = {
    port: 8883,
    username: 'localhost',
    clientId: 'angularclient',
    path: '/mqtt',
  };
  client: any;
  constructor() {
    try {
      this.client = mqtt.connect(
        'ws://eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
        this.options
      );
    } catch (error) {
      console.log(error);
    }
  }
}
/*
hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
  port: 8883,
  username: 'localhost',
  clientId: 'angularclient',
*/
