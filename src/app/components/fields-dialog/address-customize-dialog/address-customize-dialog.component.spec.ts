import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCustomizeDialogComponent } from './address-customize-dialog.component';

describe('AddressCustomizeDialogComponent', () => {
  let component: AddressCustomizeDialogComponent;
  let fixture: ComponentFixture<AddressCustomizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressCustomizeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCustomizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
