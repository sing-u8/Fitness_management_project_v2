import { TestBed } from '@angular/core/testing';

import { SetCenterService } from './set-center.service';

describe('SetCenterService', () => {
  let service: SetCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
