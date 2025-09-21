import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UsuariosComponent } from './usuarios';
import { UsuariosService } from '../../services/usuarios.service';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;

  beforeEach(async () => {
    const mockUsuariosService = jasmine.createSpyObj('UsuariosService', ['getUsuarios', 'createUsuario', 'updateUsuario', 'deleteUsuario']);
    mockUsuariosService.getUsuarios.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [UsuariosComponent],
      providers: [
        { provide: UsuariosService, useValue: mockUsuariosService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
