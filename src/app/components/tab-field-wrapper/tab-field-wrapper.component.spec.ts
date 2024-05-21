import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFieldWrapperComponent } from './tab-field-wrapper.component';

describe('TabFieldWrapperComponent', () => {
  let component: TabFieldWrapperComponent;
  let fixture: ComponentFixture<TabFieldWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabFieldWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFieldWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
