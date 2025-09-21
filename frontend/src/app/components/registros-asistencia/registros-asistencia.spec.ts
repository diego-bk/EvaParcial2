import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RegistrosAsistenciaComponent } from './registros-asistencia';
import { RegistrosAsistenciaService } from '../../services/registros-asistencia.service';
import { AsistentesService } from '../../services/asistentes.service';
import { ConferenciasService } from '../../services/conferencias.service';

describe('RegistrosAsistenciaComponent', () => {
  let component: RegistrosAsistenciaComponent;
  let fixture: ComponentFixture<RegistrosAsistenciaComponent>;

  beforeEach(async () => {
    const mockRegistrosService = jasmine.createSpyObj('RegistrosAsistenciaService', ['getRegistros', 'createRegistro', 'updateRegistro', 'deleteRegistro']);
    const mockAsistentesService = jasmine.createSpyObj('AsistentesService', ['getAsistentes']);
    const mockConferenciasService = jasmine.createSpyObj('ConferenciasService', ['getConferencias']);

    mockRegistrosService.getRegistros.and.returnValue(of([]));
    mockAsistentesService.getAsistentes.and.returnValue(of([]));
    mockConferenciasService.getConferencias.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RegistrosAsistenciaComponent],
      providers: [
        { provide: RegistrosAsistenciaService, useValue: mockRegistrosService },
        { provide: AsistentesService, useValue: mockAsistentesService },
        { provide: ConferenciasService, useValue: mockConferenciasService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
