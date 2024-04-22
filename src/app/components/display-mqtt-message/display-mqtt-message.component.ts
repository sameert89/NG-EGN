import { IMqttMessage, MqttService } from 'ngx-mqtt';
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

  constructor(private readonly mqttService: MqttService) {
    // Subscribe to check when the MQTT client successfully connects to the
    // broker
    console.log('I ran');
    this.connectionSubscription = this.mqttService.onConnect.subscribe(() => {
      console.log('Connected to MQTT broker successfully');
    });

    // Subscribe to listen for messages on a specific topic
    this.subscription = this.mqttService
      .observe('angularmqttdemo/topic1')
      .subscribe((message: IMqttMessage) => {
        console.log('New message received');
        this.message = message.payload.toString(); // Converting message payload to string
      });

    // Optional: Subscribe to connection error events
    this.mqttService.onError.subscribe((error) => {
      console.log('Connection to MQTT broker failed:', error);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.connectionSubscription?.unsubscribe();
  }
}
