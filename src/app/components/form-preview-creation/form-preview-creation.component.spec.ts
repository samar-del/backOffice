import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreviewCreationComponent } from './form-preview-creation.component';

describe('FormPreviewCreationComponent', () => {
  let component: FormPreviewCreationComponent;
  let fixture: ComponentFixture<FormPreviewCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPreviewCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPreviewCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
