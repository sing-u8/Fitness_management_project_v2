import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProductInfoComponent } from './payment-product-info.component';

describe('PaymentProductInfoComponent', () => {
  let component: PaymentProductInfoComponent;
  let fixture: ComponentFixture<PaymentProductInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PaymentProductInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
