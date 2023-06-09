import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProductItemComponent } from './payment-product-item.component';

describe('PaymentProductItemComponent', () => {
  let component: PaymentProductItemComponent;
  let fixture: ComponentFixture<PaymentProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentProductItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
