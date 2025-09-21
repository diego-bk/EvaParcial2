import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class RegistrosAsistenciaService {
  private apiUrl = `${environment.apiUrl}/RegistrosAsistencia`;

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

  getRegistros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getAll(): Observable<any[]> {
    return this.getRegistros();
  }

  getRegistro(conferenciaId: number, asistenteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${conferenciaId}/${asistenteId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createRegistro(registro: any): Observable<any> {
    console.log('Datos enviados al backend (POST):', JSON.stringify(registro, null, 2));
    console.log('URL:', this.apiUrl);
    console.log('Headers:', this.getHeaders());
    return this.http.post<any>(this.apiUrl, registro, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateRegistro(conferenciaId: number, asistenteId: number, registro: any): Observable<any> {
    console.log('Datos enviados al backend (PUT):', JSON.stringify(registro, null, 2));
    console.log('URL:', `${this.apiUrl}/${conferenciaId}/${asistenteId}`);
    console.log('Headers:', this.getHeaders());
    return this.http.put<any>(`${this.apiUrl}/${conferenciaId}/${asistenteId}`, registro, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteRegistro(conferenciaId: number, asistenteId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${conferenciaId}/${asistenteId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error completo del servicio:', error);
    let errorMessage = 'Error en la operación';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 400) {
        const details = error.error?.message || error.error || 'Datos inválidos';
        errorMessage = `Error 400 - Solicitud inválida: ${details}`;
      } else if (error.status === 401) {
        errorMessage = 'Error 401 - No autorizado. Verifique su sesión.';
      } else if (error.status === 404) {
        errorMessage = 'Error 404 - Recurso no encontrado.';
      } else {
        errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.message || error.message || error.statusText}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}