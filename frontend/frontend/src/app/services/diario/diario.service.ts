import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiarioService {
  private apiUrl = 'http://51.68.70.108:8000/api/articulos'; // URL correcta de la API
  //private apiUrl = `${environment.apiUrl}/articulos`;

  constructor(private http: HttpClient) {}

  // Método para obtener eventos desde la API
  getArticulos(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  eliminarArticulo(articuloId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${articuloId}`);
  }

  obtenerArticulo(articuloId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${articuloId}`);
  }

  editarArticulo(articuloId: number, articuloData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${articuloId}`, articuloData);
}

  crearArticulo(articuloData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, articuloData);
  }
}
