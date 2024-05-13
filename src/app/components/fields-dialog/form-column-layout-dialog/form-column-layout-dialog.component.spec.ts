import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormColumnLayoutDialogComponent } from './form-column-layout-dialog.component';

describe('FormColumnLayoutDialogComponent', () => {
  let component: FormColumnLayoutDialogComponent;
  let fixture: ComponentFixture<FormColumnLayoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormColumnLayoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormColumnLayoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
