import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CofradiasService } from '../../services/cofradias/cofradias.service';
import { enviroment } from '../../../enviroments/enviroment';

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
  cofradiaSeleccionadaId: number | null = null;
  mesSeleccionado: number | null = null;
  nuevaCofradia: any;
  cofradiaId: number = 0;
  listaCofradiasFiltrada: any[] = []; // lista filtrada de cofradías
  listaEventosFiltrada: any[] = []; // lista filtrada

  cofradiasAdmin: any[] = [];

  mostrarPopup = false;
  popupExito = false;
  inputPassword = '';
  password = enviroment.contrasenaCrearCofradia;

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
    private favoritosService: FavoritosService,
    private cofradiasService: CofradiasService
  ) { }

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
        this.cofradiasAdmin = this.cofradias.filter((cofradia) =>
          this.eventos.some((evento) => evento.cofradia === cofradia.id)
        );
        this.favoritos = response.favoritos ?? [];
        this.listaEventosFiltrada = [...this.eventos]; // <-- inicializamos aquí correctamente
        this.listaCofradiasFiltrada = [...this.cofradias];
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
      detalles: (document.getElementById('detalles') as HTMLInputElement).value,
      lugar: (document.getElementById('lugar') as HTMLInputElement).value,

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

  palabraFiltro: string = ''; // 🔹 variable para guardar el texto del input

  filtroTotal(event: Event): void {
    this.palabraFiltro = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros(); // usa el mismo sistema de filtro general
  }



  seleccionarMes(event: any): void {
    const valor = event.target.value;
    this.mesSeleccionado = valor ? Number(valor) : null;
    this.aplicarFiltros();
  }


  aplicarFiltros(): void {
    this.eventos = this.todoslosEventos.filter(evento => {


      const coincideMes =
        !this.mesSeleccionado || this.mesSeleccionado === 0 ||
        (new Date(evento.fecha).getMonth() + 1) === this.mesSeleccionado;

    
      


        //el 
      const coincideTitulo =
        !this.palabraFiltro || evento.nombre.toLowerCase().includes(this.palabraFiltro) ||   (this.cofradias.find(c => c.id === evento.cofradia)?.nombre.toLowerCase().includes(this.palabraFiltro));

      return  coincideMes && coincideTitulo;
    }); 
  }

  // ------ VALIDAR CONTRASEÑA Y CERRRAR POP UP-----

  validarPassword() {
    if (this.inputPassword === this.password) {
      this.mostrarPopup = false;
      this.popupExito = true;
    }
  }


  cerrarPopupExito() {
  this.mostrarPopup = false;
  this.popupExito = false;
}

  // --- Crear o borrar cofradias ----

  eliminarCofradia(id: number) {
    this.cofradiasService.eliminarCofradia(id).subscribe({
      next: (res) => {
        console.log(res.message);
        this.cofradias = this.cofradias.filter(c => c.id !== id); // Actualizar lista
      },
      error: (err) => {
        console.error('Error al eliminar cofradía', err);
        alert('No se pudo eliminar la cofradía    ');
      }
    });
  }


  crearCofradia() {
    if (!this.nuevaCofradia.trim()) {
      alert('Debes ingresar un nombre'); // Validación simple
      return;
    }

    const nueva: any = { nombre: this.nuevaCofradia.trim() };

    this.cofradiasService.crearCofradia(nueva).subscribe({
      next: (res) => {
        console.log('Cofradía creada', res);
        this.cofradias.push(res.cofradia); // Si quieres actualizar lista
        this.nuevaCofradia = ''; // Limpiar input
      },
      error: (err) => {
        console.error('Error al crear cofradía', err);
        alert('No se pudo crear la cofradía');
      }
    });
  }

  // ---- ELIMINAR EVENTO ----
  eliminarEvento(id: number) {
    this.eventosService.eliminarEvento(id).subscribe({
      next: (res) => {
        console.log(res.message);
        this.eventos = this.eventos.filter(c => c.id !== id); // Actualizar lista
        this.listaEventosFiltrada = this.listaEventosFiltrada
      },
      error: (err) => {
        console.error('Error al eliminar cofradía', err);
        alert('No se pudo eliminar la cofradía    ');
      }
    });
  }

  filtrarEventos(event: any) {
    const valor = event.target.value.toLowerCase();

    this.listaEventosFiltrada = this.eventos.filter(evento => {
      // Buscar el nombre de la cofradía correspondiente al evento
      const nombreCofradia = this.cofradias.find(c => c.id === evento.cofradia)?.nombre.toLowerCase() || '';

      // Filtrar por nombre del evento o por nombre de cofradía
      return evento.nombre.toLowerCase().includes(valor) || nombreCofradia.includes(valor);
    });
  }


  // Filtrar cofradías por texto
  filtrarCofradias(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.listaCofradiasFiltrada = this.cofradias.filter(c =>
      c.nombre.toLowerCase().includes(valor) ||
      c.id.toString().includes(valor)
    );
  }



  crearEventoAdmin(event?: Event): void {
    event?.preventDefault(); // Evita recarga si se lanza desde un botón 

    // Obtener valores del formulario
    const nombre = (document.getElementById('nameAdmin') as HTMLInputElement)?.value;
    const fecha = (document.getElementById('fechaAdmin') as HTMLInputElement)?.value;
    const hora = (document.getElementById('horaAdmin') as HTMLInputElement)?.value;
    const lugar = (document.getElementById('lugarAdmin') as HTMLInputElement)?.value;
    const detalles = (document.getElementById('detallesAdmin') as HTMLTextAreaElement)?.value;
    const cofradiaSelect = (document.getElementById('cofradiaAdmin') as HTMLSelectElement)?.value;

    // Validación básica
    if (!nombre || !fecha || !hora || !lugar || !detalles || !cofradiaSelect) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // Construir objeto de datos
    const eventoData = {
      nombre,
      fecha,
      hora,
      lugar,
      detalles,
      cofradia: Number(cofradiaSelect)
    };

    // Enviar al backend
    this.eventosService.crearEvento(eventoData).subscribe({
      next: (response) => {
        console.log('Evento creado:', response);
        alert('Evento creado correctamente');
      },
      error: (error) => {
        console.error('Error al crear el evento:', error);
        alert('No se pudo crear el evento');
      }
    });

    (document.getElementById('nameAdmin') as HTMLInputElement).value = '';
    (document.getElementById('fechaAdmin') as HTMLInputElement).value = '';
    (document.getElementById('horaAdmin') as HTMLInputElement).value = '';
    (document.getElementById('lugarAdmin') as HTMLInputElement).value = '';
    (document.getElementById('detallesAdmin') as HTMLTextAreaElement).value = '';
    (document.getElementById('cofradiaAdmin') as HTMLSelectElement).value = '';
  }


}
