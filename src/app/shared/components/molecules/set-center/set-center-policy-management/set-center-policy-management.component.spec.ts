import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCenterPolicyManagementComponent } from './set-center-policy-management.component';

describe('SetCenterPolicyManagementComponent', () => {
  let component: SetCenterPolicyManagementComponent;
  let fixture: ComponentFixture<SetCenterPolicyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCenterPolicyManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCenterPolicyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
