import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsAutoTransmitComponent } from './sms-auto-transmit.component';

describe('SmsAutoTransmitComponent', () => {
  let component: SmsAutoTransmitComponent;
  let fixture: ComponentFixture<SmsAutoTransmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SmsAutoTransmitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsAutoTransmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
