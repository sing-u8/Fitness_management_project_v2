import { TestBed } from '@angular/core/testing';

import { SearchAddressService } from './search-address.service';

describe('SearchAddressService', () => {
  let service: SearchAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
