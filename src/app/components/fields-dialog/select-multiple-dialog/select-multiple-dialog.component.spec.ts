import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleDialogComponent } from './select-multiple-dialog.component';

describe('SelectMultipleDialogComponent', () => {
  let component: SelectMultipleDialogComponent;
  let fixture: ComponentFixture<SelectMultipleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMultipleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultipleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
