import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';


@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private apiUrl = enviroment.backendApiKey + '/favoritos';

  constructor(private http: HttpClient) { }

  eliminarFavorito(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  anadirFavorito(data: {
    id_usuario: number;
    id_evento: number;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}`, data, { headers });
  }
}
