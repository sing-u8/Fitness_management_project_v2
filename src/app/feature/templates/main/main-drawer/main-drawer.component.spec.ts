import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDrawerComponent } from './main-drawer.component';

describe('MainDrawerComponent', () => {
  let component: MainDrawerComponent;
  let fixture: ComponentFixture<MainDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MainDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
