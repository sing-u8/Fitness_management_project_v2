import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextfieldButtonComponent } from './textfield-button.component';

describe('TextfieldButtonComponent', () => {
  let component: TextfieldButtonComponent;
  let fixture: ComponentFixture<TextfieldButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextfieldButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextfieldButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
