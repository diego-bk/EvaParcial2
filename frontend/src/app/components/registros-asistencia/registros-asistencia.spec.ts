import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosAsistencia } from './registros-asistencia';

describe('RegistrosAsistencia', () => {
  let component: RegistrosAsistencia;
  let fixture: ComponentFixture<RegistrosAsistencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrosAsistencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosAsistencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
