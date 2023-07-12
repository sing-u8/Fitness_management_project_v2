import { TestBed } from '@angular/core/testing';

import { CenterProductsService } from './center-products.service';

describe('CenterProductsService', () => {
  let service: CenterProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
