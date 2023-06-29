import { TestBed } from '@angular/core/testing';

import { CenterOperatingHoursService } from './center-operating-hours.service';

describe('CenterOperatingHoursService', () => {
  let service: CenterOperatingHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterOperatingHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
