import { Component, OnInit } from '@angular/core';
import { CofradiasService } from '../../services/cofradias/cofradias.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { UbicacionesService } from '../../services/ubicaciones/ubicaciones.service';

@Component({
  selector: 'app-mi-cofradia',
  standalone: false,
  templateUrl: './mi-cofradia.component.html',
  styleUrl: './mi-cofradia.component.css'
})
export class MiCofradiaComponent implements OnInit {
  cargando = true;
  noEncontrada = false;
  guardando = false;

  cofradia: any = null;
  provincias: string[] = [];
  municipios: string[] = [];

  constructor(
    private cofradiasService: CofradiasService,
    private notificacionService: NotificacionService,
    private ubicacionesService: UbicacionesService
  ) { }

  ngOnInit(): void {
    this.ubicacionesService.obtenerProvincias().subscribe(provincias => {
      this.provincias = provincias;
    });

    this.cofradiasService.obtenerMiCofradia().subscribe({
      next: (res) => {
        this.cofradia = res;
        this.cofradia.titulares = this.normalizarTitulares(this.cofradia.titulares);
        if (this.cofradia.provincia) {
          this.ubicacionesService.obtenerMunicipios(this.cofradia.provincia).subscribe(municipios => {
            this.municipios = municipios;
          });
        }
        this.cargando = false;
      },
      error: () => {
        this.noEncontrada = true;
        this.cargando = false;
      }
    });
  }

  onProvinciaChange(): void {
    this.cofradia.localidad = '';
    this.municipios = [];
    if (!this.cofradia.provincia) return;
    this.ubicacionesService.obtenerMunicipios(this.cofradia.provincia).subscribe(municipios => {
      this.municipios = municipios;
    });
  }

  agregarTitular(): void {
    this.cofradia.titulares.push({ nombre: '', foto_url: '' });
  }

  quitarTitular(index: number): void {
    this.cofradia.titulares.splice(index, 1);
    if (this.cofradia.titulares.length === 0) {
      this.cofradia.titulares.push({ nombre: '', foto_url: '' });
    }
  }

  private normalizarTitulares(titulares: any[]): { nombre: string; foto_url: string }[] {
    const lista = (titulares || []).map((t: any) =>
      typeof t === 'string'
        ? { nombre: t, foto_url: '' }
        : { nombre: t?.nombre || '', foto_url: t?.foto_url || '' }
    );
    return lista.length > 0 ? lista : [{ nombre: '', foto_url: '' }];
  }

  guardar(): void {
    if (!this.cofradia?.nombre) {
      this.notificacionService.error('El nombre de la cofradía es obligatorio.');
      return;
    }

    this.guardando = true;
    const datos = {
      ...this.cofradia,
      titulares: (this.cofradia.titulares || [])
        .map((t: any) => ({ nombre: (t.nombre || '').trim(), foto_url: (t.foto_url || '').trim() }))
        .filter((t: any) => t.nombre.length > 0),
    };
    this.cofradiasService.actualizarMiCofradia(datos).subscribe({
      next: (res) => {
        this.cofradia = res;
        this.cofradia.titulares = this.normalizarTitulares(this.cofradia.titulares);
        this.guardando = false;
        this.notificacionService.exito('Perfil actualizado correctamente.');
      },
      error: (err) => {
        this.guardando = false;
        this.notificacionService.error(err.error?.message || 'No se pudo guardar el perfil.');
      }
    });
  }
}
