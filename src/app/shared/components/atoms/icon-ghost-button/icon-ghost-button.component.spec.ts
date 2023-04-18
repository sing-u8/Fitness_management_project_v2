import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGhostButtonComponent } from './icon-ghost-button.component';

describe('IconGhostButtonComponent', () => {
  let component: IconGhostButtonComponent;
  let fixture: ComponentFixture<IconGhostButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconGhostButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconGhostButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
