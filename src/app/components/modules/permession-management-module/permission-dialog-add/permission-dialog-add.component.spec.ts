import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionDialogAddComponent } from './permission-dialog-add.component';

describe('PermissionDialogAddComponent', () => {
  let component: PermissionDialogAddComponent;
  let fixture: ComponentFixture<PermissionDialogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionDialogAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionDialogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
