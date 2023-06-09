import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentResultModalComponent } from './payment-result-modal.component';

describe('PaymentResultModalComponent', () => {
  let component: PaymentResultModalComponent;
  let fixture: ComponentFixture<PaymentResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PaymentResultModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
