import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantModalComponent } from './vacant-modal.component';

describe('VacantModalComponent', () => {
  let component: VacantModalComponent;
  let fixture: ComponentFixture<VacantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacantModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
