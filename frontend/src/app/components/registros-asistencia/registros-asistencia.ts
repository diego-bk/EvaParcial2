import { Component, OnInit } from '@angular/core';
import { RegistrosAsistenciaService } from '../../services/registros-asistencia.service';
import { AsistentesService } from '../../services/asistentes.service';
import { ConferenciasService } from '../../services/conferencias.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RegistroAsistencia {
  id: number;
  asistente_id: number;
  conferencia_id: number;
  fecha_registro: string;
  asistio: boolean;
}

interface Asistente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  conferencia_id: number;
}

interface Conferencia {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: string;
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
    id: 0,
    asistente_id: 0,
    conferencia_id: 0,
    fecha_registro: new Date().toISOString().split('T')[0],
    asistio: false
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
    this.cargarRegistros();
    this.cargarAsistentes();
    this.cargarConferencias();
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
    this.asistentesService.getAll().subscribe({
      next: (data) => {
        this.asistentes = data;
      },
      error: (error) => {
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
    const asistente = this.asistentes.find(a => a.id === id);
    return asistente ? asistente.nombre : 'Desconocido';
  }

  getTituloConferencia(id: number): string {
    const conferencia = this.conferencias.find(c => c.id === id);
    return conferencia ? conferencia.titulo : 'Desconocida';
  }

  // Métodos para el modal de crear
  abrirModalCrear(): void {
    this.nuevoRegistro = {
      id: 0,
      asistente_id: 0,
      conferencia_id: 0,
      fecha_registro: new Date().toISOString().split('T')[0],
      asistio: false
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

    this.registrosService.create(this.nuevoRegistro).subscribe({
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

    this.registrosService.update(this.registroSeleccionado).subscribe({
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

    this.registrosService.delete(this.registroSeleccionado.id).subscribe({
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
