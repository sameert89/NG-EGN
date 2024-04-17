import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMqttMessageComponent } from './display-mqtt-message.component';

describe('DisplayMqttMessageComponent', () => {
  let component: DisplayMqttMessageComponent;
  let fixture: ComponentFixture<DisplayMqttMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayMqttMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayMqttMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
