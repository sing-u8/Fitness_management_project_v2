import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationFieldComponent } from './verification-field.component';

describe('VerificationFieldComponent', () => {
  let component: VerificationFieldComponent;
  let fixture: ComponentFixture<VerificationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
