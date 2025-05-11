import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Evento } from '../../interfaces/agenda';
import { EventosService } from '../../../services/eventos/eventos.service';
import { Usuario } from '../../interfaces/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit, OnChanges {
  @Input() public evento!: Evento;
  @Input() public esUsuario!: boolean;
  @Input() public esCofradia!: boolean;
  @Input() public usuario!: Usuario;
  @Input() public cofradias: any[] = [];  // ✅ Recibido desde el padre

  cofradiaNombre: string = '';

  constructor(private eventosService: EventosService, private router: Router) {}

  ngOnInit(): void {
    this.calculaCofradiaNombre();  // ✅ Ahora calculamos el nombre inmediatamente
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cofradias'] || changes['evento'] || changes['usuario']) {
        this.calculaCofradiaNombre();
    }
}
  calculaCofradiaNombre(): void {
    if (this.cofradias && this.evento) {
        const cofradia = this.cofradias.find(c => c.id === this.evento.cofradia);
        this.cofradiaNombre = cofradia ? cofradia.nombre : 'Desconocida';

        console.log('Cofradia Nombre:', this.cofradiaNombre);
        console.log('Usuario:', this.usuario?.name ?? 'Usuario no definido');  // ✅ Verificar si usuario existe.
    }
}

  eliminarEvento(eventoId: number): void {
    this.eventosService.eliminarEvento(eventoId).subscribe(() => {
      console.log(`Evento ${eventoId} eliminado`);
      window.location.reload();
    });
  }

  editarEvento(eventoId: number): void {
    this.router.navigate(['/editar', eventoId]);
  }
}
