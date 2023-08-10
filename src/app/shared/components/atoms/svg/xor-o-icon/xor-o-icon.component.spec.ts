import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XorOIconComponent } from './xor-o-icon.component';

describe('XorOIconComponent', () => {
  let component: XorOIconComponent;
  let fixture: ComponentFixture<XorOIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XorOIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XorOIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
