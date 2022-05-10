import { TestBed } from '@angular/core/testing';

import { MainHistoryService } from './main-history.service';

describe('MainHistoryService', () => {
  let service: MainHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
