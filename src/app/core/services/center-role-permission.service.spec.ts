import { TestBed } from '@angular/core/testing';

import { CenterRolePermissionService } from './center-role-permission.service';

describe('CenterRolePermissionService', () => {
  let service: CenterRolePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterRolePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
