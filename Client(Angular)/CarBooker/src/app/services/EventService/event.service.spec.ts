import { TestBed } from '@angular/core/testing';

import { CarBookingService } from './event.service';

describe('CarBookingService', () => {
  let service: CarBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
