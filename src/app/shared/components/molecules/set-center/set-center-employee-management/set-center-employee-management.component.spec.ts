import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCenterEmployeeManagementComponent } from './set-center-employee-management.component';

describe('SetCenterEmployeeManagementComponent', () => {
  let component: SetCenterEmployeeManagementComponent;
  let fixture: ComponentFixture<SetCenterEmployeeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCenterEmployeeManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCenterEmployeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
