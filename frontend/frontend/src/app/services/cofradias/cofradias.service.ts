import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
@Injectable({
  providedIn: 'root',
})
export class CofradiasService {
  private apiUrl = enviroment.backendApiKey + '/cofradias';

  constructor(private http: HttpClient) { }

  getCofradias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obtenerCofradia(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${nombre}`);
  }

  eliminarCofradia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }


  crearCofradia(cofradiaData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cofradiaData);
  }

  obtenerPerfil(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/perfil`);
  }

  enviarContacto(id: number, datos: { nombre: string; email: string; mensaje: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/contacto`, datos);
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obtenerMiCofradia(): Observable<any> {
    return this.http.get<any>(`${enviroment.backendApiKey}/mi-cofradia`, { headers: this.authHeaders() });
  }

  actualizarMiCofradia(data: any): Observable<any> {
    return this.http.put<any>(`${enviroment.backendApiKey}/mi-cofradia`, data, { headers: this.authHeaders() });
  }
}
