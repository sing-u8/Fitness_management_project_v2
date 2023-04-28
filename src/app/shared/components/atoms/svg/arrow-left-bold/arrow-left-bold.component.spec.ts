import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowLeftBoldComponent } from './arrow-left-bold.component';

describe('ArrowLeftBoldComponent', () => {
  let component: ArrowLeftBoldComponent;
  let fixture: ComponentFixture<ArrowLeftBoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowLeftBoldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowLeftBoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
