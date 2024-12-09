import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarGenericComponent } from './sidebar-generic.component';

describe('SidebarGenericComponent', () => {
  let component: SidebarGenericComponent;
  let fixture: ComponentFixture<SidebarGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarGenericComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
