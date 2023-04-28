import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowRightBoldComponent } from './arrow-right-bold.component';

describe('ArrowRightBoldComponent', () => {
  let component: ArrowRightBoldComponent;
  let fixture: ComponentFixture<ArrowRightBoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowRightBoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowRightBoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
