import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaretCdlComponent } from './caret-cdl.component';

describe('CaretCdlComponent', () => {
  let component: CaretCdlComponent;
  let fixture: ComponentFixture<CaretCdlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaretCdlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaretCdlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
