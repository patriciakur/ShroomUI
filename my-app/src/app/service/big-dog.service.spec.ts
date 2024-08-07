import { TestBed } from '@angular/core/testing';

import { BigDogService } from './big-dog.service';

describe('BigDogService', () => {
  let service: BigDogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BigDogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
