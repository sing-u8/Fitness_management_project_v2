import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegPhoneComponent } from './reg-phone.component';

describe('RegPhoneComponent', () => {
  let component: RegPhoneComponent;
  let fixture: ComponentFixture<RegPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RegPhoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
