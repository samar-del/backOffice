import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GRoleComponent } from './g-role.component';

describe('GRoleComponent', () => {
  let component: GRoleComponent;
  let fixture: ComponentFixture<GRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
