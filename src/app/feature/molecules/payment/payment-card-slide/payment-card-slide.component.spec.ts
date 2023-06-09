import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCardSlideComponent } from './payment-card-slide.component';

describe('PaymentCardSlideComponent', () => {
  let component: PaymentCardSlideComponent;
  let fixture: ComponentFixture<PaymentCardSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PaymentCardSlideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCardSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
