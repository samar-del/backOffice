import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFileDialogComponent } from './form-file-dialog.component';

describe('FormFileDialogComponent', () => {
  let component: FormFileDialogComponent;
  let fixture: ComponentFixture<FormFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFileDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
