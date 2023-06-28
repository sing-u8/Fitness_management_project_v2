import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeRedwhaleAppComponent } from './notice-redwhale-app.component';

describe('NoticeRedwhaleAppComponent', () => {
  let component: NoticeRedwhaleAppComponent;
  let fixture: ComponentFixture<NoticeRedwhaleAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NoticeRedwhaleAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeRedwhaleAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
