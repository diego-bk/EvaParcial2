import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

interface Usuario {
  usuario_id: number;
  username: string;
  rol: string;
  estado: boolean | string; // Puede venir como boolean o string desde el backend
  password?: string; // Solo para creación
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
  nuevoUsuario: Usuario = { usuario_id: 0, username: '', rol: '', estado: true, password: '' };
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
    this.nuevoUsuario = { usuario_id: 0, username: '', rol: 'Usuario', estado: true, password: '' };
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
    
    // Crear el objeto UsuarioUpdateDTO con solo los campos necesarios
    const usuarioUpdateDTO = {
      username: this.usuarioSeleccionado.username,
      password: this.usuarioSeleccionado.password && this.usuarioSeleccionado.password.trim() !== '' 
        ? this.usuarioSeleccionado.password 
        : null,
      rol: this.usuarioSeleccionado.rol,
      estado: this.usuarioSeleccionado.estado === true || this.usuarioSeleccionado.estado === 'true' 
        ? true 
        : this.usuarioSeleccionado.estado === false || this.usuarioSeleccionado.estado === 'false'
        ? false
        : null
    };
    
    console.log('Usuario seleccionado:', this.usuarioSeleccionado);
    console.log('DTO a enviar:', usuarioUpdateDTO);
    console.log('ID del usuario:', this.usuarioSeleccionado.usuario_id);
    console.log('Tipos de datos en DTO:');
    console.log('- username:', typeof usuarioUpdateDTO.username, usuarioUpdateDTO.username);
    console.log('- password:', typeof usuarioUpdateDTO.password, usuarioUpdateDTO.password);
    console.log('- rol:', typeof usuarioUpdateDTO.rol, usuarioUpdateDTO.rol);
    console.log('- estado:', typeof usuarioUpdateDTO.estado, usuarioUpdateDTO.estado);
    
    this.usuariosService.updateUsuario(this.usuarioSeleccionado.usuario_id, usuarioUpdateDTO).subscribe({
      next: () => {
        console.log('Usuario actualizado exitosamente');
        this.cargarUsuarios();
        this.cerrarModalEditar();
      },
      error: (error) => {
        console.error('Error completo:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
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
    this.usuariosService.deleteUsuario(this.usuarioSeleccionado.usuario_id).subscribe({
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
