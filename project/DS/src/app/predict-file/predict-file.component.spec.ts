import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictFileComponent } from './predict-file.component';

describe('PredictFileComponent', () => {
  let component: PredictFileComponent;
  let fixture: ComponentFixture<PredictFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
