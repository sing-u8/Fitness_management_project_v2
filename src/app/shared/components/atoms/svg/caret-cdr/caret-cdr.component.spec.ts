import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretCdrComponent } from './caret-cdr.component';

describe('CaretCdrComponent', () => {
  let component: CaretCdrComponent;
  let fixture: ComponentFixture<CaretCdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretCdrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretCdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
