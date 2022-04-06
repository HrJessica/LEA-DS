import { TestBed } from '@angular/core/testing';

import { TrainUFileService } from './train-u-file.service';

describe('TrainUFileService', () => {
  let service: TrainUFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainUFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
