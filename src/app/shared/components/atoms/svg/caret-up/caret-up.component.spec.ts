import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretUpComponent } from './caret-up.component';

describe('CaretUpComponent', () => {
  let component: CaretUpComponent;
  let fixture: ComponentFixture<CaretUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
