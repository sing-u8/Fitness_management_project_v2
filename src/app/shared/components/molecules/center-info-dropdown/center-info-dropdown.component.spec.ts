import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterInfoDropdownComponent } from './center-info-dropdown.component';

describe('CenterInfoDropdownComponent', () => {
  let component: CenterInfoDropdownComponent;
  let fixture: ComponentFixture<CenterInfoDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterInfoDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterInfoDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
