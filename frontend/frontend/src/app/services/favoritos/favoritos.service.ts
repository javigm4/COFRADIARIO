import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorito } from './../../pages/interfaces/agenda'; // Importar el modelo de Favorito
import { map } from 'rxjs/operators'; // Importar el operador map para transformar la respuesta

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
 private apiUrl = 'http://127.0.0.1:8000/api/eventos';  // URL correcta de la API

  constructor(private http: HttpClient) {}

  eliminarFavorito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
