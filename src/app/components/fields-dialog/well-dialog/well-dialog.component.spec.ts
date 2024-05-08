import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellDialogComponent } from './well-dialog.component';

describe('WellDialogComponent', () => {
  let component: WellDialogComponent;
  let fixture: ComponentFixture<WellDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WellDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
