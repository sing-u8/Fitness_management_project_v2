import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegCompletedComponent } from './reg-completed.component';

describe('RegCompletedComponent', () => {
  let component: RegCompletedComponent;
  let fixture: ComponentFixture<RegCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RegCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
