import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCenterPaymentManagementComponent } from './set-center-payment-management.component';

describe('SetCenterPaymentManagementComponent', () => {
  let component: SetCenterPaymentManagementComponent;
  let fixture: ComponentFixture<SetCenterPaymentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCenterPaymentManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCenterPaymentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
