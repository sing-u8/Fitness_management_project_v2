import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterExpiredModalComponent } from './center-expired-modal.component';

describe('CenterExpiredModalComponent', () => {
  let component: CenterExpiredModalComponent;
  let fixture: ComponentFixture<CenterExpiredModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterExpiredModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterExpiredModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
