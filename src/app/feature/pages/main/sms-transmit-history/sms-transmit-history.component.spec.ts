import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTransmitHistoryComponent } from './sms-transmit-history.component';

describe('SmsTransmitHistoryComponent', () => {
  let component: SmsTransmitHistoryComponent;
  let fixture: ComponentFixture<SmsTransmitHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SmsTransmitHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsTransmitHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
