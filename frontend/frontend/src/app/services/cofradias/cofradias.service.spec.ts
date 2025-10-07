import { TestBed } from '@angular/core/testing';

import { CofradiasService } from './cofradias.service';

describe('CofradiasService', () => {
  let service: CofradiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CofradiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
