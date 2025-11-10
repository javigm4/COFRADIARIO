import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, switchMap, map, catchError, delay, retryWhen, scan } from 'rxjs';
import { TiempoDia } from '../../widgets/interfaces/tiempo-dia.interface';
import { enviroment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private baseUrl = 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/29067';
  private apiKey = enviroment.weatherApiKey; // tu API Key de AEMET

  constructor(private http: HttpClient) { }

  getForecast(): Observable<TiempoDia[]> {
    const cache = localStorage.getItem('weatherCache');
    const cacheTime = localStorage.getItem('weatherCacheTime');

    const now = Date.now();

    // Si hay cache y no han pasado 24h, devolvemos cache
    if (cache && cacheTime && (now - Number(cacheTime) < 24 * 60 * 60 * 1000)) {
      return of(JSON.parse(cache));
    }

    // Si no hay cache o ya pasó 24h, llamamos a la API
    return this.http.get<{ datos: string }>(`${this.baseUrl}?api_key=${this.apiKey}`).pipe(
      switchMap(res =>
        this.http.get<any>(res.datos, { headers: { 'api_key': this.apiKey } })
      ),
      map((data: any) => {
        const dias = data[0].prediccion.dia.map((d: any) => {
          const rawCode = d.estadoCielo?.[0]?.value;
          console.log(rawCode)

          return {
            date: d.fecha,
            temperatura: { min: d.temperatura.minima, max: d.temperatura.maxima },
            precipitacion: d.probPrecipitacion?.[0]?.value ?? 0,
            icono: this.mapIcon(rawCode)
          };
        });

        // Guardar en cache
        localStorage.setItem('weatherCache', JSON.stringify(dias));
        localStorage.setItem('weatherCacheTime', now.toString());

        return dias;
      }),
      retryWhen(errors =>
        errors.pipe(
          scan((acc, error) => {
            if (acc >= 2) throw error; // Reintenta máximo 2 veces
            return acc + 1;
          }, 0),
          delay(2000) // espera 2s antes de reintentar
        )
      ),
      catchError(err => {
        console.error('Error al obtener datos de AEMET:', err);
        // fallback: devolver cache aunque esté vieja
        if (cache) return of(JSON.parse(cache));
        return throwError(() => new Error('No se pudo obtener el pronóstico ni existe cache.'));
      })
    );
  }

private mapIcon(code?: string): string {
  const cleanCode = code?.replace(/[^\d]/g, '') ?? '';

  const sol = ['11', '12', '14', '15'];
  const nublado = ['13', '16', '17', '18', '19', '20', '21'];
  const lluvia = ['43', '44', '45', '46', '47', '48'];
  const tormenta = ['50', '51', '52', '53', '54'];
  const nieve = ['60', '61', '62', '63', '64', '65'];

  if (lluvia.includes(cleanCode)) return '../../../../public/images/icons/lluvia.png';
  if (tormenta.includes(cleanCode)) return '../../../../public/images/icons/tormenta.png';
  if (nieve.includes(cleanCode)) return '../../../../public/images/icons/nieve.png';
  if (nublado.includes(cleanCode)) return '../../../../public/images/icons/nublado.png';
  if (sol.includes(cleanCode)) return '../../../../public/images/icons/sol.png';

  return '../../../../public/images/icons/sol.png';
}


}
