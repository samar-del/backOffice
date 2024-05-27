import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperDialogComponent } from './stepper-dialog.component';

describe('StepperDialogComponent', () => {
  let component: StepperDialogComponent;
  let fixture: ComponentFixture<StepperDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
