import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegEmailComponent } from './reg-email.component';

describe('RegEmailComponent', () => {
  let component: RegEmailComponent;
  let fixture: ComponentFixture<RegEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RegEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
