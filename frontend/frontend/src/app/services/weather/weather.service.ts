import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.weatherapi.com/v1/forecast.json';  // URL base para pronóstico
  private apiKey = "dfa33c8d7d8b42b992701547250705";

  constructor(private http: HttpClient) {}
  // Método para obtener los datos del pronóstico para los próximos 7 días
  getForecast(city: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}&days=7`;  // 'days=7' para pronóstico de 7 días
    return this.http.get<any>(url);
  }
}
