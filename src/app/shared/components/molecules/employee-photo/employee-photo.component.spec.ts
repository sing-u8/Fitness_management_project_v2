import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePhotoComponent } from './employee-photo.component';

describe('EmployeePhotoComponent', () => {
  let component: EmployeePhotoComponent;
  let fixture: ComponentFixture<EmployeePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
