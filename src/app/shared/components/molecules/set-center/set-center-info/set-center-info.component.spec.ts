import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCenterInfoComponent } from './set-center-info.component';

describe('SetCenterInfoComponent', () => {
  let component: SetCenterInfoComponent;
  let fixture: ComponentFixture<SetCenterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCenterInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCenterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
