import { TestBed } from '@angular/core/testing';

import { CenterNoticeService } from './center-notice.service';

describe('CenterNoticeService', () => {
  let service: CenterNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
