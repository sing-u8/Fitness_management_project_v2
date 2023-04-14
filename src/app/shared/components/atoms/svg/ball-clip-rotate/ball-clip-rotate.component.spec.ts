import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallClipRotateComponent } from './ball-clip-rotate.component';

describe('BallClipRotateComponent', () => {
  let component: BallClipRotateComponent;
  let fixture: ComponentFixture<BallClipRotateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallClipRotateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallClipRotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
