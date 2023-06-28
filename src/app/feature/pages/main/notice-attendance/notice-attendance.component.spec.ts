import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeAttendanceComponent } from './notice-attendance.component';

describe('NoticeAttendanceComponent', () => {
  let component: NoticeAttendanceComponent;
  let fixture: ComponentFixture<NoticeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NoticeAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
