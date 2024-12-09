import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomizeDialogComponent } from './select-customize-dialog.component';

describe('SelectCustomizeDialogComponent', () => {
  let component: SelectCustomizeDialogComponent;
  let fixture: ComponentFixture<SelectCustomizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCustomizeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCustomizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
