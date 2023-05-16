import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLockerComponent } from './product-locker.component';

describe('ProductLockerComponent', () => {
  let component: ProductLockerComponent;
  let fixture: ComponentFixture<ProductLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductLockerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
