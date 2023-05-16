import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsGeneralTransmitComponent } from './sms-general-transmit.component';

describe('SmsGeneralTransmitComponent', () => {
  let component: SmsGeneralTransmitComponent;
  let fixture: ComponentFixture<SmsGeneralTransmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SmsGeneralTransmitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsGeneralTransmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
