import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone: false,
})
export class AgendaComponent implements OnInit {
  eventos: any[] = [];
  cofradias: any[] = [];
  favoritos: any[] = [];
  esUsuario: boolean = false;
  esCofradia: boolean = false;
  usuario: any;
  minFechaHoy: string = new Date().toISOString().split('T')[0]; // Establece la fecha mínima al día de hoy

  constructor(
    private eventosService: EventosService,
    private authService: AuthService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioData(); //  Obtener el usuario desde `localStorage`

    if (usuario) {
      this.usuario = usuario;
      this.esUsuario = usuario.role === 'usuario';
      this.esCofradia = usuario.role === 'cofradia';
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.eventosService.getEventos().subscribe(
      (response) => {
        this.eventos = response.eventos ?? [];
        this.cofradias = response.cofradias ?? [];
        this.favoritos = response.favoritos ?? [];
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

  // ----- C R E A R   E V E N T O -----
  crearEvento(): void {

    if (!this.esCofradia) {
      alert('Solo una cofradía puede crear eventos.');
      return;
    }

    // Ahora this.usuario está definido y tiene la propiedad name
    const cofradiaId =
      this.cofradias.find((c) => c.nombre === this.usuario.name)?.id || 0;
    const fechaInput = (document.getElementById('fecha') as HTMLInputElement)
      .value;
    const horaInput = (document.getElementById('hora') as HTMLInputElement)
      .value;

    const eventoData = {
      nombre: (document.getElementById('name') as HTMLInputElement).value,
      fecha: fechaInput,
      hora: horaInput,
      cofradia: cofradiaId,
    };

    this.eventosService.crearEvento(eventoData).subscribe(
  (response) => {
    console.log('Evento creado:', response);
    window.location.reload();
  },
  (error) => {
    if (error.status === 401) {
      alert('Debes autenticar tu correo antes de crear un evento.');
    } else if (error.status === 403) {
      alert('No tienes permisos para crear eventos. Debes autenticar tu correo antes.');
    } else {
      alert('Error al crear el evento. Inténtalo más tarde.');
    }
    console.error('Error al crear el evento:', error);
  }
);

  }

  // ----- E L I M I N A R   F A V O R I TO -----
  onEliminar(favoritoId: number): void {
    console.log('Eliminar favorito con ID:', favoritoId);
    this.favoritosService.eliminarFavorito(favoritoId).subscribe(
      () => {
        console.log('Favorito eliminado correctamente');
        this.favoritos = this.favoritos.filter((f) => f.id !== favoritoId);
      },
      (error) => {
        console.error('Error al eliminar el favorito:', error);
      }
    );
  }

  // ----- M O S T R A R / O C U L T A R   F A V O R I T O S -----
  toggleFavoritos(): void {
    const favoritosContainer = document.querySelector('.contenedor-favoritos');

    if (favoritosContainer) {
      favoritosContainer.classList.toggle('activo');
    }
  }
}
