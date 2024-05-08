import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellWrapperComponent } from './well-wrapper.component';

describe('WellWrapperComponent', () => {
  let component: WellWrapperComponent;
  let fixture: ComponentFixture<WellWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WellWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
