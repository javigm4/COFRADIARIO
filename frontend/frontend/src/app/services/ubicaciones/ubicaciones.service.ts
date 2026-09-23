import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UbicacionesService {
  private datos$: Observable<Record<string, string[]>> | null = null;

  constructor(private http: HttpClient) { }

  private cargarDatos(): Observable<Record<string, string[]>> {
    if (!this.datos$) {
      this.datos$ = this.http.get<Record<string, string[]>>('/public/data/municipios-espana.json').pipe(
        shareReplay(1)
      );
    }
    return this.datos$;
  }

  obtenerProvincias(): Observable<string[]> {
    return this.cargarDatos().pipe(map(datos => Object.keys(datos)));
  }

  obtenerMunicipios(provincia: string | null | undefined): Observable<string[]> {
    if (!provincia) return of([]);
    return this.cargarDatos().pipe(map(datos => datos[provincia] || []));
  }
}
