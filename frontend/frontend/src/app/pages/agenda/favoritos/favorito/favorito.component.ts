import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Favorito, Cofradia, Evento } from '../../../interfaces/agenda';


@Component({
  selector: 'app-favorito',
  standalone: false,
  templateUrl: './favorito.component.html',
  styleUrl: './favorito.component.css'
})
export class FavoritoComponent {
  @Input() favorito!: Favorito;
  @Input() eventos: Evento[] = [];
  @Input() cofradias: Cofradia[] = [];

  @Output() eliminarFavorito = new EventEmitter<number>();

  getEventoNombre(): string {
  if (!this.eventos || this.eventos.length === 0 || !this.favorito.id_evento) {
    return 'Evento desconocido';
  }
  console.log('Buscando evento para favorito:', this.favorito);
  const evento = this.eventos.find(e => e.id === this.favorito.id_evento);
  return evento ? evento.nombre : 'Evento desconocido';
}

getCofradiaNombre(): string {
  if (!this.eventos || this.eventos.length === 0 || !this.favorito.id_evento) {
    return 'Cofradía desconocida';
  }
  const evento = this.eventos.find(e => e.id === this.favorito.id_evento);
  if (evento) {
    const cofradia = this.cofradias.find(c => c.id === evento.cofradia);
    return cofradia ? cofradia.nombre : 'Cofradía desconocida';
  }
  return 'Cofradía desconocida';
}

getFecha(): string {
  const evento = this.eventos.find(e => e.id === this.favorito.id_evento);
  if (evento) {
    return evento.fecha;
  }
  return " Fecha no encontrada";
}

onEliminar(): void {
  this.eliminarFavorito.emit(this.favorito.id);
}

}
