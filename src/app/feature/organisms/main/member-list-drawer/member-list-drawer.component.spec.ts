import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberListDrawerComponent } from './member-list-drawer.component';

describe('MemberListDrawerComponent', () => {
  let component: MemberListDrawerComponent;
  let fixture: ComponentFixture<MemberListDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MemberListDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberListDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
