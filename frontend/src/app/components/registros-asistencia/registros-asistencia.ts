import { Component, OnInit } from '@angular/core';
import { RegistrosAsistenciaService } from '../../services/registros-asistencia.service';
import { AsistentesService } from '../../services/asistentes.service';
import { ConferenciasService } from '../../services/conferencias.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

interface RegistroAsistencia {
  conferencia_id: number;
  asistente_id: number;
  asistencia: boolean;
  nombreConferencia?: string;
  nombreAsistente?: string;
  apellidoAsistente?: string;
}

// DTOs que coinciden exactamente con el backend
interface RegistroAsistenciaCreateDTO {
  conferencia_id: number;
  asistente_id: number;
  asistencia: boolean;
}

interface RegistroAsistenciaUpdateDTO {
  asistencia: boolean;
}

interface Asistente {
  asistente_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

interface Conferencia {
  conferencia_id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  usuario_id: number;
  username?: string;
}

@Component({
  selector: 'app-registros-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registros-asistencia.html',
})
export class RegistrosAsistenciaComponent implements OnInit {
  registros: RegistroAsistencia[] = [];
  asistentes: Asistente[] = [];
  conferencias: Conferencia[] = [];
  loading = false;
  errorMessage = '';

  // Modal crear
  mostrarModalCrear = false;
  nuevoRegistro: RegistroAsistencia = {
    conferencia_id: 0,
    asistente_id: 0,
    asistencia: false
  };

  // Modal editar
  mostrarModalEditar = false;
  registroSeleccionado: RegistroAsistencia | null = null;

  // Modal eliminar
  mostrarModalEliminar = false;

  constructor(
    private registrosService: RegistrosAsistenciaService,
    private asistentesService: AsistentesService,
    private conferenciasService: ConferenciasService
  ) {}

  ngOnInit(): void {
    // Cargar asistentes y conferencias primero, luego los registros
    this.cargarAsistentesYConferencias();
  }

  cargarAsistentesYConferencias(): void {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('Iniciando carga de datos de referencia...');
    
    // Usar forkJoin para cargar asistentes y conferencias en paralelo
    forkJoin({
      asistentes: this.asistentesService.getAll(),
      conferencias: this.conferenciasService.getAll()
    }).subscribe({
      next: (data) => {
        console.log('Datos de referencia cargados:', data);
        
        // Asignar los datos
        this.asistentes = data.asistentes;
        this.conferencias = data.conferencias;
        
        console.log('Asistentes asignados:', this.asistentes);
        console.log('Conferencias asignadas:', this.conferencias);
        
        // Ahora cargar los registros
        this.cargarRegistros();
      },
      error: (error) => {
        console.error('Error al cargar datos de referencia:', error);
        this.errorMessage = 'Error al cargar los datos de referencia: ' + error.message;
        this.loading = false;
      }
    });
  }

  cargarRegistros(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.registrosService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los registros de asistencia: ' + error.message;
        this.loading = false;
      }
    });
  }

  cargarAsistentes(): void {
    console.log('Cargando asistentes...');
    this.asistentesService.getAll().subscribe({
      next: (data) => {
        console.log('Asistentes recibidos del backend:', data);
        this.asistentes = data;
        console.log('Array asistentes después de asignar:', this.asistentes);
      },
      error: (error) => {
        console.error('Error al cargar asistentes:', error);
        this.errorMessage = 'Error al cargar los asistentes: ' + error.message;
      }
    });
  }

  cargarConferencias(): void {
    this.conferenciasService.getAll().subscribe({
      next: (data) => {
        this.conferencias = data;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las conferencias: ' + error.message;
      }
    });
  }

  getNombreAsistente(id: number): string {
    console.log('getNombreAsistente llamado con ID:', id);
    console.log('Array asistentes actual:', this.asistentes);
    const asistente = this.asistentes.find(a => a.asistente_id === id);
    console.log('Asistente encontrado:', asistente);
    return asistente ? `${asistente.nombre} ${asistente.apellido}` : 'Desconocido';
  }

  getTituloConferencia(id: number): string {
    const conferencia = this.conferencias.find(c => c.conferencia_id === id);
    return conferencia ? conferencia.nombre : 'Desconocida';
  }

  // Métodos para el modal de crear
  abrirModalCrear(): void {
    this.nuevoRegistro = {
      conferencia_id: 0,
      asistente_id: 0,
      asistencia: false
    };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  crearRegistro(): void {
    if (this.nuevoRegistro.asistente_id === 0 || this.nuevoRegistro.conferencia_id === 0) {
      this.errorMessage = 'Por favor, seleccione un asistente y una conferencia.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Crear el objeto exactamente como lo espera el backend
    const registroDTO: RegistroAsistenciaCreateDTO = {
      conferencia_id: Number(this.nuevoRegistro.conferencia_id),
      asistente_id: Number(this.nuevoRegistro.asistente_id),
      asistencia: Boolean(this.nuevoRegistro.asistencia)
    };

    console.log('Datos a enviar:', registroDTO);

    this.registrosService.createRegistro(registroDTO).subscribe({
      next: () => {
        this.cargarRegistros();
        this.cerrarModalCrear();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al crear el registro: ' + error.message;
        this.loading = false;
      }
    });
  }

  // Métodos para el modal de editar
  abrirModalEditar(registro: RegistroAsistencia): void {
    this.registroSeleccionado = { ...registro };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.registroSeleccionado = null;
  }

  actualizarRegistro(): void {
    if (!this.registroSeleccionado) return;

    this.loading = true;
    this.errorMessage = '';

    // Crear el objeto exactamente como lo espera el backend
    const registroDTO: RegistroAsistenciaUpdateDTO = {
      asistencia: Boolean(this.registroSeleccionado.asistencia)
    };

    console.log('Datos a actualizar:', registroDTO);
    console.log('IDs:', this.registroSeleccionado.conferencia_id, this.registroSeleccionado.asistente_id);

    this.registrosService.updateRegistro(
      Number(this.registroSeleccionado.conferencia_id), 
      Number(this.registroSeleccionado.asistente_id), 
      registroDTO
    ).subscribe({
      next: () => {
        this.cargarRegistros();
        this.cerrarModalEditar();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el registro: ' + error.message;
        this.loading = false;
      }
    });
  }

  // Métodos para el modal de eliminar
  abrirModalEliminar(registro: RegistroAsistencia): void {
    this.registroSeleccionado = registro;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.registroSeleccionado = null;
  }

  eliminarRegistro(): void {
    if (!this.registroSeleccionado) return;

    this.loading = true;
    this.errorMessage = '';

    this.registrosService.deleteRegistro(
      this.registroSeleccionado.conferencia_id, 
      this.registroSeleccionado.asistente_id
    ).subscribe({
      next: () => {
        this.cargarRegistros();
        this.cerrarModalEliminar();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar el registro: ' + error.message;
        this.loading = false;
      }
    });
  }
}
