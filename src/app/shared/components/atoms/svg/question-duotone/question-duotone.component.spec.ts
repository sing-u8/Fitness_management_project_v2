import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionDuotoneComponent } from './question-duotone.component';

describe('QuestionDuotoneComponent', () => {
  let component: QuestionDuotoneComponent;
  let fixture: ComponentFixture<QuestionDuotoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionDuotoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDuotoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
