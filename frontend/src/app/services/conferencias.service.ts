import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ConferenciasService {
  private apiUrl = `${environment.apiUrl}/Conferencias`;

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

  getConferencias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAll(): Observable<any[]> {
    return this.getConferencias();
  }

  getConferencia(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  createConferencia(conferencia: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, conferencia, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateConferencia(conferencia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${conferencia.conferencia_id}`, conferencia, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteConferencia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'Error en la operación';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}