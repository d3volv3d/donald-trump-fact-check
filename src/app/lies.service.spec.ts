import { TestBed, inject } from '@angular/core/testing';

import { LiesService } from './lies.service';

describe('LiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiesService]
    });
  });

  it('should be created', inject([LiesService], (service: LiesService) => {
    expect(service).toBeTruthy();
  }));
});
