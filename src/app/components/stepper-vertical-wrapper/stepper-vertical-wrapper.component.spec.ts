import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperVerticalWrapperComponent } from './stepper-vertical-wrapper.component';

describe('StepperVerticalWrapperComponent', () => {
  let component: StepperVerticalWrapperComponent;
  let fixture: ComponentFixture<StepperVerticalWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperVerticalWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperVerticalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
