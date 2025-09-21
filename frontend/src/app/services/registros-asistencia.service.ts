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

  getRegistro(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createRegistro(registro: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, registro, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateRegistro(registro: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${registro.id}`, registro, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteRegistro(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let errorMessage = 'Error en la operación';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}