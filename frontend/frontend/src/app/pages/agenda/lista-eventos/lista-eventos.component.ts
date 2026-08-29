import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Evento } from '../../interfaces/agenda';
@Component({
  selector: 'app-lista-eventos',
  standalone: false,
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css'
})
export class ListaEventosComponent implements OnChanges {
  @Input() eventos: Evento[] = [];
  @Input() esCofradia: boolean = false;
  @Input() usuario: any = null;
  @Input() cofradias: any[] = [];
  @Input() favoritos: any[] = [];
  @Input() eventoDestacado: number | null = null;
  @Output() favoritoAnadido = new EventEmitter<void>();
  @Output() editarEvento = new EventEmitter<Evento>();

  gruposEventos: { fecha: string; eventos: Evento[] }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventos']) {
      this.actualizarGrupos();
    }
  }

  private actualizarGrupos(): void {
    const m: { [key: string]: Evento[] } = {};
    this.eventos.forEach(e => {
      // Normalizar la fecha: extrae YYYY-MM-DD independientemente de si usa 'T' o espacio como separador
      const fechaObj = new Date(e.fecha);
      if (!isNaN(fechaObj.getTime())) {
        const fecha = fechaObj.toISOString().split('T')[0];
        (m[fecha] = m[fecha] || []).push(e);
      } else {
        // Fallback si por alguna razón falla el objeto Date
        const fecha = e.fecha.includes('T') ? e.fecha.split('T')[0] : e.fecha.split(' ')[0];
        (m[fecha] = m[fecha] || []).push(e);
      }
    });

    this.gruposEventos = Object.keys(m).sort().map(fecha => ({
      fecha,
      eventos: m[fecha]
    }));
  }

  getDiaNombre(fechaStr: string): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const dt = new Date(fechaStr);
    const dn = dias[dt.getDay()];
    const d = dt.getDate();
    const m = dt.getMonth();
    const y = dt.getFullYear();

    return `${dn.charAt(0).toUpperCase() + dn.slice(1)}, ${d} de ${meses[m]} de ${y}`;
  }
}
