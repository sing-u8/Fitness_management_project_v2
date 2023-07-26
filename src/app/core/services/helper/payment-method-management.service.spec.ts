import { TestBed } from '@angular/core/testing';

import { PaymentMethodManagementService } from './payment-method-management.service';

describe('PaymentMethodManagementService', () => {
  let service: PaymentMethodManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentMethodManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
