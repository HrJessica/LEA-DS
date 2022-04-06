import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PklComponent } from './pkl.component';

describe('PklComponent', () => {
  let component: PklComponent;
  let fixture: ComponentFixture<PklComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PklComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PklComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
