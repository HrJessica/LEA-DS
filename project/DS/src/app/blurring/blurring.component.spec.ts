import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurringComponent } from './blurring.component';

describe('BlurringComponent', () => {
  let component: BlurringComponent;
  let fixture: ComponentFixture<BlurringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlurringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
