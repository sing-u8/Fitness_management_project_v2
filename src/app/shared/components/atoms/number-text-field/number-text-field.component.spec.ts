import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberTextFieldComponent } from './number-text-field.component';

describe('NumberTextFieldComponent', () => {
  let component: NumberTextFieldComponent;
  let fixture: ComponentFixture<NumberTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberTextFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
