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
  cofradiasEventos: any[] = []; //es el filtro del nombre de las cofradias que tienen eventos
  todoslosEventos: any[] = []; //para guardar todos los eventos y poder filtrarlos por cofradia
  fechaFiltro: string | null = null;
  mesesAno = [
    { id: 0, nombre: 'Todos los meses' }, // Añadimos una opción para mostrar todos los eventos
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' },
  ];

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
        this.cofradiasEventos = this.cofradias.filter((cofradia) =>
          this.eventos.some((evento) => evento.cofradia === cofradia.id)
        ); //filtramos las cofradías que tienen eventos para mostrarlas en el select
        this.favoritos = response.favoritos ?? [];

        this.todoslosEventos = [...this.eventos]; // copia los eventos originales (con esto copiamos el contenido del array, no la referencia al array , que ocurre si hacemos this.todoslosEventos = this.eventos)
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
          alert(
            'No tienes permisos para crear eventos. Debes autenticar tu correo antes.'
          );
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

  // ----- F I L T R A R   E V E N T O S   P O R   C O F R A D Í A -----
  seleccionarCofradia(event: any): void {
    const cofradiaSeleccionadaId = Number(event.target.value);
    console.log(
      '----------------------------------',
      cofradiaSeleccionadaId,
      '----------------------------------'
    );

    if (cofradiaSeleccionadaId) {
      this.eventos = this.todoslosEventos.filter(
        (evento) => evento.cofradia === cofradiaSeleccionadaId
      );
    } else {
      // Mostrar todos los eventos si no hay selección
      this.eventos = [...this.todoslosEventos];
    }
  }

  // ----- F I L T R A R   E V E N T O S   P O R   F E C H A -----
  seleccionarMes(event: any): void {
  const mesSeleccionado = Number(event.target.value);

    if (mesSeleccionado === 0) {
      this.eventos = [...this.todoslosEventos];
      return;
    } else if (mesSeleccionado) {
      this.eventos = this.todoslosEventos.filter((evento) => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getMonth() + 1 === Number(mesSeleccionado);
      });
    } else {
      // Mostrar todos los eventos si no hay selección
      this.eventos = [...this.todoslosEventos];
    }
  }
}
