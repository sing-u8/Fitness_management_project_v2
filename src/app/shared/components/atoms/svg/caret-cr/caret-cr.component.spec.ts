import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretCrComponent } from './caret-cr.component';

describe('CaretCrComponent', () => {
  let component: CaretCrComponent;
  let fixture: ComponentFixture<CaretCrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretCrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretCrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
