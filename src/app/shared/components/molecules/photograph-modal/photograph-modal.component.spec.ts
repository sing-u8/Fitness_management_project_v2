import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographModalComponent } from './photograph-modal.component';

describe('PhotographModalComponent', () => {
  let component: PhotographModalComponent;
  let fixture: ComponentFixture<PhotographModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotographModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotographModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
