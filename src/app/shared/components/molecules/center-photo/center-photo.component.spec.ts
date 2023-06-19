import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterPhotoComponent } from './center-photo.component';

describe('CenterPhotoComponent', () => {
  let component: CenterPhotoComponent;
  let fixture: ComponentFixture<CenterPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterPhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
