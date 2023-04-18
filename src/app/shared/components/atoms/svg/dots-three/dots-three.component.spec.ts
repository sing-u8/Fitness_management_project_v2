import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsThreeComponent } from './dots-three.component';

describe('DotsThreeComponent', () => {
  let component: DotsThreeComponent;
  let fixture: ComponentFixture<DotsThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotsThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotsThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
