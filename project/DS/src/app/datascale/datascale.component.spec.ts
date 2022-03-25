import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatascaleComponent } from './datascale.component';

describe('DatascaleComponent', () => {
  let component: DatascaleComponent;
  let fixture: ComponentFixture<DatascaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatascaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatascaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
