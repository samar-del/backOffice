import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelFormDialogComponent } from './tel-form-dialog.component';

describe('TelFormDialogComponent', () => {
  let component: TelFormDialogComponent;
  let fixture: ComponentFixture<TelFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
