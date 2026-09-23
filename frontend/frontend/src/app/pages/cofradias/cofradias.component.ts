import { Component, OnInit } from '@angular/core';
import { CofradiasService } from '../../services/cofradias/cofradias.service';

interface GrupoProvincia {
  provincia: string;
  cofradias: any[];
}

@Component({
  selector: 'app-cofradias',
  standalone: false,
  templateUrl: './cofradias.component.html',
  styleUrl: './cofradias.component.css'
})
export class CofradiasComponent implements OnInit {
  cofradias: any[] = [];
  cargando = true;

  busqueda = '';
  provinciasSeleccionadas = new Set<string>();
  provinciasConteo: { nombre: string; total: number }[] = [];

  grupos: GrupoProvincia[] = [];
  filtrosAbiertos = false;

  constructor(private cofradiasService: CofradiasService) { }

  ngOnInit(): void {
    this.cofradiasService.getCofradias().subscribe({
      next: (res) => {
        this.cofradias = res || [];
        this.calcularProvincias();
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  private calcularProvincias(): void {
    const mapa = new Map<string, number>();
    this.cofradias.forEach(c => {
      if (c.provincia) mapa.set(c.provincia, (mapa.get(c.provincia) || 0) + 1);
    });
    this.provinciasConteo = Array.from(mapa.entries())
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total);
  }

  toggleProvincia(nombre: string): void {
    if (this.provinciasSeleccionadas.has(nombre)) {
      this.provinciasSeleccionadas.delete(nombre);
    } else {
      this.provinciasSeleccionadas.add(nombre);
    }
    this.aplicarFiltros();
  }

  hayFiltrosActivos(): boolean {
    return this.provinciasSeleccionadas.size > 0 || !!this.busqueda;
  }

  limpiarFiltros(): void {
    this.provinciasSeleccionadas.clear();
    this.busqueda = '';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.trim().toLowerCase();

    let filtradas = this.cofradias.filter(c => {
      const coincideProvincia = this.provinciasSeleccionadas.size === 0 || this.provinciasSeleccionadas.has(c.provincia);
      const coincideTexto = !texto ||
        (c.nombre || '').toLowerCase().includes(texto) ||
        (c.localidad || '').toLowerCase().includes(texto) ||
        (c.provincia || '').toLowerCase().includes(texto);
      return coincideProvincia && coincideTexto;
    });

    // Dentro de cada provincia, las cofradías de una misma localidad quedan consecutivas
    // (ordenadas alfabéticamente por localidad) pero sin cabecera propia de localidad.
    filtradas = filtradas.sort((a, b) => {
      const cmpLocalidad = (a.localidad || 'Sin localidad').localeCompare(b.localidad || 'Sin localidad');
      if (cmpLocalidad !== 0) return cmpLocalidad;
      return (a.nombre || '').localeCompare(b.nombre || '');
    });

    // Agrupación por provincia (mismo patrón que ListaEventosComponent.actualizarGrupos()).
    const mapa: { [key: string]: any[] } = {};
    filtradas.forEach(c => {
      const key = c.provincia || 'Sin provincia';
      (mapa[key] = mapa[key] || []).push(c);
    });

    this.grupos = Object.keys(mapa)
      .sort((a, b) => a.localeCompare(b, 'es'))
      .map(provincia => ({ provincia, cofradias: mapa[provincia] }));
  }
}
