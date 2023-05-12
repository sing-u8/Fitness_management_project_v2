import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattingDrawerComponent } from './chatting-drawer.component';

describe('ChattingDrawerComponent', () => {
  let component: ChattingDrawerComponent;
  let fixture: ComponentFixture<ChattingDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ChattingDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChattingDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
