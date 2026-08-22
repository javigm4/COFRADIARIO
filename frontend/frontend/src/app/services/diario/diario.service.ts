import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class DiarioService {

  private apiUrl = enviroment.backendApiKey + '/articulos';
  private apiUrlUltimosArticulos = enviroment.backendApiKey + '/ultimosArticulos';
  constructor(private http: HttpClient) { }


  // Método para obtener eventos desde la API
  getArticulos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
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
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.post<any>(this.apiUrl, articuloData, { headers });
  }


  getUltimosArticulos(): Observable<any> {
    return this.http.get<any>(this.apiUrlUltimosArticulos);
  }

}
