import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private apiUrl = 'http://127.0.0.1:8000/api/favoritos'; // URL correcta de la API

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
