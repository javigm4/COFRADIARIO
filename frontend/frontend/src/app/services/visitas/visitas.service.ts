import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class VisitasService {
  private apiUrl = enviroment.backendApiKey + '/visitas';

  constructor(private http: HttpClient) { }

  registrar(ruta: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { ruta });
  }
}
