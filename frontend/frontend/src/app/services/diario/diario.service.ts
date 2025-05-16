import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DiarioService {

   private apiUrl = 'http://127.0.0.1:8000/api/articulos';  // URL correcta de la API

  constructor(private http: HttpClient) {}

  // Método para obtener eventos desde la API
  getArticulos(): Observable<any> {
  return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }
}
