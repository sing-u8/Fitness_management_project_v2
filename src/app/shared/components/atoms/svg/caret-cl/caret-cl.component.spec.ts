import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretClComponent } from './caret-cl.component';

describe('CaretClComponent', () => {
  let component: CaretClComponent;
  let fixture: ComponentFixture<CaretClComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretClComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretClComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
