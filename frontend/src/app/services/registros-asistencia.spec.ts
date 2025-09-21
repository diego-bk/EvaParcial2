import { TestBed } from '@angular/core/testing';

import { RegistrosAsistencia } from './registros-asistencia';

describe('RegistrosAsistencia', () => {
  let service: RegistrosAsistencia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrosAsistencia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
