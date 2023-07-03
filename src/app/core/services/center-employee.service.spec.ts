import { TestBed } from '@angular/core/testing';

import { CenterEmployeeService } from './center-employee.service';

describe('CenterEmployeeService', () => {
  let service: CenterEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
