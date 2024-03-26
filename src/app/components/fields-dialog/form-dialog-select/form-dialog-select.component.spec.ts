import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogSelectComponent } from './form-dialog-select.component';

describe('FormDialogSelectComponent', () => {
  let component: FormDialogSelectComponent;
  let fixture: ComponentFixture<FormDialogSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDialogSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
