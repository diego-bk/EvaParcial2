import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', rol: '' };
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  errorMessage = '';
  loading = false;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  abrirModalCrear(): void {
    this.nuevoUsuario = { id: 0, nombre: '', email: '', rol: '' };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  crearUsuario(): void {
    this.loading = true;
    this.usuariosService.createUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModalCrear();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  abrirModalEditar(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.usuarioSeleccionado = null;
  }

  actualizarUsuario(): void {
    if (!this.usuarioSeleccionado) return;
    
    this.loading = true;
    this.usuariosService.updateUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModalEditar();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  abrirModalEliminar(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.usuarioSeleccionado = null;
  }

  eliminarUsuario(): void {
    if (!this.usuarioSeleccionado) return;
    
    this.loading = true;
    this.usuariosService.deleteUsuario(this.usuarioSeleccionado.id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModalEliminar();
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }
}
