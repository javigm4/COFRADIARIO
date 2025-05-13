import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Evento } from '../../interfaces/agenda';
import { EventosService } from '../../../services/eventos/eventos.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit, OnChanges {
  @Input() public evento!: Evento;
  @Input() public cofradias: any[] = [];  // ✅ Recibido desde el padre
  role : string = '';
  cofradiaNombre: string = '';
  nombreUsuario : string ='';
  constructor(private eventosService: EventosService, private router: Router, private authService : AuthService) {}

  ngOnInit(): void {
    this.calculaCofradiaNombre();  //  Ahora calculamos el nombre inmediatamente
    const usuario = this.authService.getUsuarioData(); //  Obtener el usuario desde `localStorage`
    this.role = usuario.role;
    this.nombreUsuario = usuario.name;
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
