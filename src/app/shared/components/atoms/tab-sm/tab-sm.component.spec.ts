import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSmComponent } from './tab-sm.component';

describe('TabSmComponent', () => {
  let component: TabSmComponent;
  let fixture: ComponentFixture<TabSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabSmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
