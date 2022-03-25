import { TestBed } from '@angular/core/testing';

import { AppSvcService } from './app-svc.service';

describe('AppSvcService', () => {
  let service: AppSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
