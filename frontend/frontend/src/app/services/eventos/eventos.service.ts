import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://127.0.0.1:8000/api/eventos';  // URL correcta de la API

  constructor(private http: HttpClient) {}

  // Método para obtener eventos desde la API
  getEventos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
//para obtener solo un evento (para el boton editar)
obtenerEvento(eventoId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${eventoId}`);
}


  // Método para eliminar un evento
  eliminarEvento(eventoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${eventoId}`);
  }

  // Método para editar un evento
  editarEvento(eventoId: number, eventoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${eventoId}`, eventoData);
}


// Método para crear un nuevo evento
  crearEvento(eventoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, eventoData);
  }

  // Método para obtener eventos por cofradía
  getEventosPorCofradia(cofradiaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cofradia/${cofradiaId}`);
  }

}
