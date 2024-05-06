import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsWrapperComponent } from './tabs-wrapper.component';

describe('TabsWrapperComponent', () => {
  let component: TabsWrapperComponent;
  let fixture: ComponentFixture<TabsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
