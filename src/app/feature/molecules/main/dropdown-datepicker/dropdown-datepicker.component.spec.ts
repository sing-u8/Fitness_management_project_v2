import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownDatepickerComponent } from './dropdown-datepicker.component';

describe('DropdownDatepickerComponent', () => {
  let component: DropdownDatepickerComponent;
  let fixture: ComponentFixture<DropdownDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DropdownDatepickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
