import { TestBed } from '@angular/core/testing';

import { CenterCustomersService } from './center-customers.service';

describe('CenterCustomersService', () => {
  let service: CenterCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
