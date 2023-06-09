import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCardResultModalComponent } from './register-card-result-modal.component';

describe('RegisterCardResultModalComponent', () => {
  let component: RegisterCardResultModalComponent;
  let fixture: ComponentFixture<RegisterCardResultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCardResultModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCardResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
