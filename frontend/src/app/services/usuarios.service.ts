import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/Usuarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUsuario(id: number, usuario: any): Observable<any> {
    console.log('Servicio - URL:', `${this.apiUrl}/${id}`);
    console.log('Servicio - Headers:', this.getHeaders());
    console.log('Servicio - Body (antes de JSON.stringify):', usuario);
    console.log('Servicio - Body (JSON.stringify):', JSON.stringify(usuario));
    
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error completo del servicio:', error);
    console.error('Error status:', error.status);
    console.error('Error statusText:', error.statusText);
    console.error('Error error:', error.error);
    console.error('Error message:', error.message);
    console.error('Error url:', error.url);
    
    let errorMessage = 'Error en la operación';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 400) {
        // Para errores 400, intentar obtener más detalles
        const details = error.error?.errors || error.error?.message || error.error || 'Datos inválidos';
        errorMessage = `Error 400 - Solicitud inválida: ${JSON.stringify(details)}`;
      } else {
        errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.message || error.message || error.statusText}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}