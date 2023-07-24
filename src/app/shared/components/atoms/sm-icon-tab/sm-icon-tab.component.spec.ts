import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmIconTabComponent } from './sm-icon-tab.component';

describe('SmIconTabComponent', () => {
  let component: SmIconTabComponent;
  let fixture: ComponentFixture<SmIconTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmIconTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmIconTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
