import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTabsLayoutDialogComponent } from './form-tabs-layout-dialog.component';

describe('FormTabsLayoutDialogComponent', () => {
  let component: FormTabsLayoutDialogComponent;
  let fixture: ComponentFixture<FormTabsLayoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormTabsLayoutDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTabsLayoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
