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
    this.calculaCofradiaNombre();
    const usuario = this.authService.getUsuarioData();
    if (usuario) {
      this.role = usuario.role;
      this.nombreUsuario = usuario.name;
    } else {
      this.role = '';
      this.nombreUsuario = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cofradias'] || changes['evento'] || changes['usuario']) {
      this.calculaCofradiaNombre();
    }
  }

  calculaCofradiaNombre(): void {
    if (this.cofradias && this.evento) {
      console.log('Cofradías:', this.cofradias);
      console.log('Evento:', this.evento);
      const cofradia = this.cofradias.find(
        (c) => c.id === this.evento.cofradia
      );
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

  anadirFavorito(eventoId: number): void {
    const usuario = this.authService.getUsuarioData();
    if (!usuario) {
      console.error('No se encontró el usuario.');
      return;
    }

    const favoritoData = {
      id_usuario: usuario.id,
      id_evento: eventoId,
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

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    const hora = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${dia} / ${mes} / ${año} - ${hora}:${minutos}`;
  }
}
