import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnSizeComponent } from './column-size.component';

describe('ColumnSizeComponent', () => {
  let component: ColumnSizeComponent;
  let fixture: ComponentFixture<ColumnSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
