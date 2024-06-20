import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubmittedContentComponent } from './form-submitted-content.component';

describe('FormSubmittedContentComponent', () => {
  let component: FormSubmittedContentComponent;
  let fixture: ComponentFixture<FormSubmittedContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSubmittedContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubmittedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
