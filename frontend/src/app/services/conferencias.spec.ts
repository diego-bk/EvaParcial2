import { TestBed } from '@angular/core/testing';

import { Conferencias } from './conferencias';

describe('Conferencias', () => {
  let service: Conferencias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conferencias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
