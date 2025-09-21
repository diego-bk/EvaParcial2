import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConferenciasService } from '../../services/conferencias.service';

interface Conferencia {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  capacidad: number;
}

@Component({
  selector: 'app-conferencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conferencias.html',
})
export class ConferenciasComponent implements OnInit {
  conferencias: Conferencia[] = [];
  nuevaConferencia: Conferencia = {
    id: 0,
    titulo: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    capacidad: 0
  };
  conferenciaSeleccionada: Conferencia | null = null;
  
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  
  loading = false;
  errorMessage = '';

  constructor(private conferenciasService: ConferenciasService) {}

  ngOnInit(): void {
    this.cargarConferencias();
  }

  cargarConferencias(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.conferenciasService.getConferencias().subscribe({
      next: (data) => {
        this.conferencias = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar conferencias:', error);
        this.errorMessage = 'Error al cargar las conferencias. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  abrirModalCrear(): void {
    this.nuevaConferencia = {
      id: 0,
      titulo: '',
      descripcion: '',
      fecha: '',
      ubicacion: '',
      capacidad: 0
    };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  crearConferencia(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.conferenciasService.createConferencia(this.nuevaConferencia).subscribe({
      next: () => {
        this.cargarConferencias();
        this.cerrarModalCrear();
      },
      error: (error) => {
        console.error('Error al crear conferencia:', error);
        this.errorMessage = 'Error al crear la conferencia. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  abrirModalEditar(conferencia: Conferencia): void {
    this.conferenciaSeleccionada = { ...conferencia };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.conferenciaSeleccionada = null;
  }

  actualizarConferencia(): void {
    if (!this.conferenciaSeleccionada) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.conferenciasService.updateConferencia(this.conferenciaSeleccionada).subscribe({
      next: () => {
        this.cargarConferencias();
        this.cerrarModalEditar();
      },
      error: (error) => {
        console.error('Error al actualizar conferencia:', error);
        this.errorMessage = 'Error al actualizar la conferencia. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  abrirModalEliminar(conferencia: Conferencia): void {
    this.conferenciaSeleccionada = conferencia;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.conferenciaSeleccionada = null;
  }

  eliminarConferencia(): void {
    if (!this.conferenciaSeleccionada) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    this.conferenciasService.deleteConferencia(this.conferenciaSeleccionada.id).subscribe({
      next: () => {
        this.cargarConferencias();
        this.cerrarModalEliminar();
      },
      error: (error) => {
        console.error('Error al eliminar conferencia:', error);
        this.errorMessage = 'Error al eliminar la conferencia. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
}
