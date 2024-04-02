import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPermissionComponent } from './g-permission.component';

describe('GPermissionComponent', () => {
  let component: GPermissionComponent;
  let fixture: ComponentFixture<GPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
