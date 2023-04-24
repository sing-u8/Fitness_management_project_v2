import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextfieldDropdownComponent } from './textfield-dropdown.component';

describe('TextfieldDropdownComponent', () => {
  let component: TextfieldDropdownComponent;
  let fixture: ComponentFixture<TextfieldDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextfieldDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextfieldDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
