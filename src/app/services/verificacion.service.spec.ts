import { TestBed } from '@angular/core/testing';

import { VerificacionService } from './verificacion.service';

describe('VerificacionService', () => {
  let service: VerificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
