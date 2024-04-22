import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttModule,
  MqttService,
} from 'ngx-mqtt';
import { Subscription } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-display-mqtt-message',
  standalone: true,
  imports: [],
  templateUrl: './display-mqtt-message.component.html',
  styleUrl: './display-mqtt-message.component.css',
})
export class DisplayMqttMessageComponent implements OnDestroy {
  private subscription?: Subscription;
  public message: string = '';
  constructor(private readonly mqttService: MqttService) {
    this.subscription = this.mqttService
      .observe('angularmqttdemo/topic1')
      .subscribe((message: IMqttMessage) => {
        console.log('henlo');
        this.message = 'Success';
        // this.message = message.payload.toString();
      });
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
/*
hostname: 'eventgridmqttangular.southindia-1.ts.eventgrid.azure.net',
  port: 8883,
  username: 'localhost',
  clientId: 'angularclient',
*/
