import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://127.0.0.1:8000/api/eventos';

  constructor(private http: HttpClient) {}

  // Obtener todos los eventos
  getEventos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtener un solo evento por ID
  obtenerEvento(eventoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventoId}`);
  }

  // Eliminar evento
  eliminarEvento(eventoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventoId}`);
  }

  // Editar evento
  editarEvento(eventoId: number, eventoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${eventoId}`, eventoData);
  }

  // Crear evento (protegido)
  crearEvento(eventoData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl, eventoData, { headers });
  }

  // Obtener eventos por cofradía
  getEventosPorCofradia(cofradiaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cofradia/${cofradiaId}`);
  }
}
