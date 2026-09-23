import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = enviroment.backendApiKey + '/admin';

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  estadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`, { headers: this.authHeaders() });
  }

  // Cofradías
  listarCofradias(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cofradias`, { headers: this.authHeaders() });
  }

  crearCofradia(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cofradias`, data, { headers: this.authHeaders() });
  }

  editarCofradia(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cofradias/${id}`, data, { headers: this.authHeaders() });
  }

  eliminarCofradia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cofradias/${id}`, { headers: this.authHeaders() });
  }

  vincularUsuario(cofradiaId: number, idUser: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cofradias/${cofradiaId}/vincular`, { id_user: idUser }, { headers: this.authHeaders() });
  }

  desvincularUsuario(cofradiaId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cofradias/${cofradiaId}/desvincular`, {}, { headers: this.authHeaders() });
  }

  usuariosSinCofradia(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios-sin-cofradia`, { headers: this.authHeaders() });
  }

  // Usuarios
  listarUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios`, { headers: this.authHeaders() });
  }

  verificarUsuario(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/${id}/verificar`, {}, { headers: this.authHeaders() });
  }

  toggleAdmin(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/${id}/toggle-admin`, {}, { headers: this.authHeaders() });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`, { headers: this.authHeaders() });
  }

  toggleCofradia(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/${id}/toggle-cofradia`, {}, { headers: this.authHeaders() });
  }
}
