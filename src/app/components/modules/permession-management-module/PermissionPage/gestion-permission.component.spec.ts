import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPermissionComponent } from './gestion-permission.component';

describe('GestionPermissionComponent', () => {
  let component: GestionPermissionComponent;
  let fixture: ComponentFixture<GestionPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
