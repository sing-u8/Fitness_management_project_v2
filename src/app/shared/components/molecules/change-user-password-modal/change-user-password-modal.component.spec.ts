import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserPasswordModalComponent } from './change-user-password-modal.component';

describe('ChangeUserPasswordModalComponent', () => {
  let component: ChangeUserPasswordModalComponent;
  let fixture: ComponentFixture<ChangeUserPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserPasswordModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUserPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
