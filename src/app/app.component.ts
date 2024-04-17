
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
    DisplayMqttMessageComponent
} from './components/display-mqtt-message/display-mqtt-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DisplayMqttMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo';
}
