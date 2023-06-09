import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDiscountBenefitComponent } from './payment-discount-benefit.component';

describe('PaymentDiscountBenefitComponent', () => {
  let component: PaymentDiscountBenefitComponent;
  let fixture: ComponentFixture<PaymentDiscountBenefitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PaymentDiscountBenefitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDiscountBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
