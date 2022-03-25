import { TestBed } from '@angular/core/testing';

import { ScaleserviceService } from './scaleservice.service';

describe('ScaleserviceService', () => {
  let service: ScaleserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScaleserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
