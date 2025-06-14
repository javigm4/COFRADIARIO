import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CofradiasService {
  private apiUrl = 'http://127.0.0.1:8000/api/cofradias'; // Ajusta tu URL

  constructor(private http: HttpClient) {}

  getCofradias(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  obtenerCofradia(nombre: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${nombre}`);
}

}
