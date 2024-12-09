import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogCheckboxComponent } from './form-dialog-checkbox.component';

describe('FormDialogCheckboxComponent', () => {
  let component: FormDialogCheckboxComponent;
  let fixture: ComponentFixture<FormDialogCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDialogCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
