import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperWrapperComponent } from './stepper-wrapper.component';

describe('StepperWrapperComponent', () => {
  let component: StepperWrapperComponent;
  let fixture: ComponentFixture<StepperWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepperWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
