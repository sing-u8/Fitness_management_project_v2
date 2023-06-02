import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XsIconButtonComponent } from './xs-icon-button.component';

describe('XsIconButtonComponent', () => {
  let component: XsIconButtonComponent;
  let fixture: ComponentFixture<XsIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XsIconButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XsIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
