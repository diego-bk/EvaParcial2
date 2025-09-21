import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistentesService } from '../../services/asistentes.service';

interface Asistente {
  asistente_id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
}

@Component({
  selector: 'app-asistentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistentes.html',
})
export class AsistentesComponent implements OnInit {
  asistentes: Asistente[] = [];
  nuevoAsistente: Asistente = {
    asistente_id: 0,
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  };
  asistenteSeleccionado: Asistente | null = null;
  
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  
  loading = false;
  errorMessage = '';

  constructor(
    private asistentesService: AsistentesService
  ) {}

  ngOnInit(): void {
    this.cargarAsistentes();
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



  abrirModalCrear(): void {
    this.nuevoAsistente = {
      asistente_id: 0,
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
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
    
    this.asistentesService.deleteAsistente(this.asistenteSeleccionado.asistente_id).subscribe({
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


}
