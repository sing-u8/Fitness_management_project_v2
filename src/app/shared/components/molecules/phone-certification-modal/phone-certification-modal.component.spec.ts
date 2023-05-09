import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCertificationModalComponent } from './phone-certification-modal.component';

describe('PhoneCertificationModalComponent', () => {
  let component: PhoneCertificationModalComponent;
  let fixture: ComponentFixture<PhoneCertificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PhoneCertificationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneCertificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
