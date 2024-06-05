import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordComponentComponent } from './dashbord-component.component';

describe('DashbordComponentComponent', () => {
  let component: DashbordComponentComponent;
  let fixture: ComponentFixture<DashbordComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashbordComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
