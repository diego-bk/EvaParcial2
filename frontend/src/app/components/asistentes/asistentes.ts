import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistentesService } from '../../services/asistentes.service';
import { ConferenciasService } from '../../services/conferencias.service';

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
}

@Component({
  selector: 'app-asistentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistentes.html',
})
export class AsistentesComponent implements OnInit {
  asistentes: Asistente[] = [];
  conferencias: Conferencia[] = [];
  nuevoAsistente: Asistente = {
    id: 0,
    nombre: '',
    email: '',
    telefono: '',
    conferencia_id: 0
  };
  asistenteSeleccionado: Asistente | null = null;
  
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  
  loading = false;
  errorMessage = '';

  constructor(
    private asistentesService: AsistentesService,
    private conferenciasService: ConferenciasService
  ) {}

  ngOnInit(): void {
    this.cargarAsistentes();
    this.cargarConferencias();
  }

  cargarAsistentes(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.asistentesService.getAsistentes().subscribe({
      next: (data) => {
        this.asistentes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asistentes:', error);
        this.errorMessage = 'Error al cargar los asistentes. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  cargarConferencias(): void {
    this.conferenciasService.getConferencias().subscribe({
      next: (data) => {
        this.conferencias = data;
      },
      error: (error) => {
        console.error('Error al cargar conferencias:', error);
      }
    });
  }

  abrirModalCrear(): void {
    this.nuevoAsistente = {
      id: 0,
      nombre: '',
      email: '',
      telefono: '',
      conferencia_id: 0
    };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  crearAsistente(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.asistentesService.createAsistente(this.nuevoAsistente).subscribe({
      next: () => {
        this.cargarAsistentes();
        this.cerrarModalCrear();
      },
      error: (error) => {
        console.error('Error al crear asistente:', error);
        this.errorMessage = 'Error al crear el asistente. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  abrirModalEditar(asistente: Asistente): void {
    this.asistenteSeleccionado = { ...asistente };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.asistenteSeleccionado = null;
  }

  actualizarAsistente(): void {
    if (!this.asistenteSeleccionado) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.asistentesService.updateAsistente(this.asistenteSeleccionado).subscribe({
      next: () => {
        this.cargarAsistentes();
        this.cerrarModalEditar();
      },
      error: (error) => {
        console.error('Error al actualizar asistente:', error);
        this.errorMessage = 'Error al actualizar el asistente. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  abrirModalEliminar(asistente: Asistente): void {
    this.asistenteSeleccionado = asistente;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.asistenteSeleccionado = null;
  }

  eliminarAsistente(): void {
    if (!this.asistenteSeleccionado) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.asistentesService.deleteAsistente(this.asistenteSeleccionado.id).subscribe({
      next: () => {
        this.cargarAsistentes();
        this.cerrarModalEliminar();
      },
      error: (error) => {
        console.error('Error al eliminar asistente:', error);
        this.errorMessage = 'Error al eliminar el asistente. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  getNombreConferencia(conferencia_id: number): string {
    const conferencia = this.conferencias.find(c => c.id === conferencia_id);
    return conferencia ? conferencia.titulo : 'No asignada';
  }
}
