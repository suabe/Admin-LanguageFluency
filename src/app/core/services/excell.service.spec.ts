import { TestBed } from '@angular/core/testing';

import { ExcellService } from './excell.service';

describe('ExcellService', () => {
  let service: ExcellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
