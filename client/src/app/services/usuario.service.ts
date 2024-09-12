import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URI = 'http://localhost:3000/api/usuario'; // URL del backend

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<{ usuarios: Usuario[] }>(`${this.API_URI}/`).pipe(
      map(response => response.usuarios),
      catchError(this.handleError)
    );
  }

  createUser(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.API_URI}/`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  getUsuarioPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URI}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error en el servidor';
    if (error.status === 400) {
      // Error específico para violaciones de unicidad
      if (error.error && (error.error.message === 'Correo electrónico ya registrado' || error.error.message === 'Nombre de usuario ya registrado')) {
        errorMessage = error.error.message;
      }
    }
    return throwError(errorMessage);
  }
}
