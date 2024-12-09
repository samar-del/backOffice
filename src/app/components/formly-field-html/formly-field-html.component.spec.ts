import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyFieldHtmlComponent } from './formly-field-html.component';

describe('FormlyFieldHtmlComponent', () => {
  let component: FormlyFieldHtmlComponent;
  let fixture: ComponentFixture<FormlyFieldHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormlyFieldHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyFieldHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
