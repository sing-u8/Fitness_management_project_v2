import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCardModalComponent } from './register-card-modal.component';

describe('RegisterCardModalComponent', () => {
  let component: RegisterCardModalComponent;
  let fixture: ComponentFixture<RegisterCardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
