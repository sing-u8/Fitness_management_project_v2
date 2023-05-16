import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSportswearComponent } from './product-sportswear.component';

describe('ProductSportswearComponent', () => {
  let component: ProductSportswearComponent;
  let fixture: ComponentFixture<ProductSportswearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductSportswearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSportswearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
