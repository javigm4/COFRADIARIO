import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Evento } from '../../interfaces/agenda';
import { EventosService } from '../../../services/eventos/eventos.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { FavoritosService } from '../../../services/favoritos/favoritos.service';

@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css'],
})
export class EventoComponent implements OnInit, OnChanges {
  @Input() public evento!: Evento;
  @Input() public cofradias: any[] = []; // ✅ Recibido desde el padre
  role: string = '';
  cofradiaNombre: string = '';
  nombreUsuario: string = '';
  constructor(
    private eventosService: EventosService,
    private router: Router,
    private authService: AuthService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.calculaCofradiaNombre(); // Calcula el nombre de la cofradía
    const usuario = this.authService.getUsuarioData(); // Obtiene el usuario desde localStorage
    if (usuario) {
      this.role = usuario.role;
      this.nombreUsuario = usuario.name;
    } else {
      // Si no hay usuario, asigna valores por defecto para que los botones no se muestren
      this.role = ''; // o cualquier valor que tu lógica interprete como "sin usuario"
      this.nombreUsuario = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cofradias'] || changes['evento'] || changes['usuario']) {
      this.calculaCofradiaNombre();
    }
  }

  //problema --------------
  calculaCofradiaNombre(): void {
    if (this.cofradias && this.evento) {
      console.log('Cofradías:', this.cofradias);
      console.log('Evento:', this.evento);
      const cofradia = this.cofradias.find(
        (c) => c.id === this.evento.cofradia
      );
      this.cofradiaNombre = cofradia ? cofradia.nombre : 'Desconocida';
    }
  } //problema --------------

  eliminarEvento(eventoId: number): void {
    this.eventosService.eliminarEvento(eventoId).subscribe(() => {
      console.log(`Evento ${eventoId} eliminado`);
      window.location.reload();
    });
  }

  editarEvento(eventoId: number): void {
    this.router.navigate(['/editar', eventoId]);
  }

 anadirFavorito(eventoId: number): void {
  const usuario = this.authService.getUsuarioData();
  if (!usuario) {
    console.error('No se encontró el usuario.');
    return;
  }

  const favoritoData = {
    id_usuario: usuario.id,
    id_evento: eventoId
  };

  this.favoritosService.anadirFavorito(favoritoData).subscribe(
    (response) => {
      console.log('Evento añadido a favoritos:', response);
      window.location.reload();
    },
    (error) => {
      if (error.status === 409) {
        alert('Ya tienes en favoritos ese evento');
      } else {
        console.error('Error al añadir a favoritos:', error);
      }
    }
  );
}

}
