import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { Evento } from '../../interfaces/agenda';
import { EventosService } from '../../../services/eventos/eventos.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FavoritosService } from '../../../services/favoritos/favoritos.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class EventoComponent implements OnInit, OnChanges {
  @Input() public evento!: Evento;
  @Input() public cofradias: any[] = []; // ✅ Recibido desde el padre
  @Input() public favoritos: any[] = []; // ✅ Recibido desde el padre
  @Input() public eventoDestacado: number | null = null; // ✅ Llega desde el calendario para abrir el acto directamente
  @Output() public favoritoAnadido = new EventEmitter<void>();
  @Output() public editarSolicitado = new EventEmitter<Evento>();
  role: string = '';
  cofradiaNombre: string = '';
  nombreUsuario: string = '';
  modalVisible = false;
  mostrarPopupRegistro = false;

  constructor(
    private eventosService: EventosService,
    private authService: AuthService,
    private favoritosService: FavoritosService,
    private elRef: ElementRef,
    private notificacionService: NotificacionService
  ) { }

  abrirModal() {
    this.modalVisible = true;
  }
  cerrarModal(event: Event) {
    event.stopPropagation();
    this.modalVisible = false;
  }

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

    if (this.eventoDestacado != null && this.eventoDestacado === this.evento?.id) {
      this.elRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => this.abrirModal(), 300);
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

  editarEvento(): void {
    this.editarSolicitado.emit(this.evento);
  }

  estaEnFavoritos(): boolean {
    return this.favoritos.some(f => f.id_evento === this.evento.id);
  }

  handleFavorito(event: Event): void {
    event.stopPropagation();
    const usuario = this.authService.getUsuarioData();
    
    if (!usuario) {
      this.mostrarPopupRegistro = true;
      return;
    }

    if (this.estaEnFavoritos()) {
      const fav = this.favoritos.find(f => f.id_evento === this.evento.id);
      if (fav) {
        this.favoritosService.eliminarFavorito(fav.id).subscribe(() => {
          this.favoritoAnadido.emit();
        });
      }
    } else {
      const favoritoData = {
        id_usuario: usuario.id,
        id_evento: this.evento.id,
      };

      this.favoritosService.anadirFavorito(favoritoData).subscribe(
        (response) => {
          this.favoritoAnadido.emit();
        },
        (error) => {
          if (error.status === 409) {
            this.notificacionService.exito('Ya tienes en favoritos ese evento');
          } else {
            console.error('Error al añadir a favoritos:', error);
          }
        }
      );
    }
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
