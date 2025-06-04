import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private apiUrl = 'http://51.68.70.108:8000/api/favoritos'; // URL correcta de la API
  //private apiUrl = `${environment.apiUrl}/favoritos`;

  constructor(private http: HttpClient) {}

  eliminarFavorito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  anadirFavorito(data: {
    id_usuario: number;
    id_evento: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data, {
      withCredentials: true,
    });
  }
}
