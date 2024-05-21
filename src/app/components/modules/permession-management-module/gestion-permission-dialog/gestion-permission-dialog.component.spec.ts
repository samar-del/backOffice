import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPermissionDialogComponent } from './gestion-permission-dialog.component';

describe('GestionPermissionDialogComponent', () => {
  let component: GestionPermissionDialogComponent;
  let fixture: ComponentFixture<GestionPermissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPermissionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
