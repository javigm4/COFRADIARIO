import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
