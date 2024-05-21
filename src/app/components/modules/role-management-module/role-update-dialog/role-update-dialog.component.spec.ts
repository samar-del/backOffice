import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleUpdateDialogComponent } from './role-update-dialog.component';

describe('RoleUpdateDialogComponent', () => {
  let component: RoleUpdateDialogComponent;
  let fixture: ComponentFixture<RoleUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
