import { TestBed } from '@angular/core/testing';

import { CarservicesService } from './car.service';

describe('CarservicesService', () => {
  let service: CarservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
