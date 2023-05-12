import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarSmileyComponent } from './avatar-smiley.component';

describe('AvatarSmileyComponent', () => {
  let component: AvatarSmileyComponent;
  let fixture: ComponentFixture<AvatarSmileyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarSmileyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarSmileyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
