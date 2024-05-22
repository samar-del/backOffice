import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyFieldPanelComponent } from './formly-field-panel.component';

describe('FormlyFieldPanelComponent', () => {
  let component: FormlyFieldPanelComponent;
  let fixture: ComponentFixture<FormlyFieldPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormlyFieldPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyFieldPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
