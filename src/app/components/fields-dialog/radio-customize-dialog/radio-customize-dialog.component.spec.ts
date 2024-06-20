import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCustomizeDialogComponent } from './radio-customize-dialog.component';

describe('RadioCustomizeDialogComponent', () => {
  let component: RadioCustomizeDialogComponent;
  let fixture: ComponentFixture<RadioCustomizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioCustomizeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioCustomizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
