import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMembershipComponent } from './product-membership.component';

describe('ProductMembershipComponent', () => {
  let component: ProductMembershipComponent;
  let fixture: ComponentFixture<ProductMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProductMembershipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
