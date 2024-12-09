import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayFormDialogComponent } from './day-form-dialog.component';

describe('DayFormDialogComponent', () => {
  let component: DayFormDialogComponent;
  let fixture: ComponentFixture<DayFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
