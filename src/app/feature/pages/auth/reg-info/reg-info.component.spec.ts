import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegInfoComponent } from './reg-info.component';

describe('RegInfoComponent', () => {
  let component: RegInfoComponent;
  let fixture: ComponentFixture<RegInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RegInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
