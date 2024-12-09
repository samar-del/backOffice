import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyFieldIframeComponent } from './formly-field-iframe.component';

describe('FormlyFieldIframeComponent', () => {
  let component: FormlyFieldIframeComponent;
  let fixture: ComponentFixture<FormlyFieldIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormlyFieldIframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyFieldIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
