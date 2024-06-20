import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFormDialogComponent } from './date-form-dialog.component';

describe('DateFormDialogComponent', () => {
  let component: DateFormDialogComponent;
  let fixture: ComponentFixture<DateFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
