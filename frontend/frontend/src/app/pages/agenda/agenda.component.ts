import { Component, OnInit, HostListener } from '@angular/core';
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
  fechaInicioFiltro: string | null = null;
  fechaFinFiltro: string | null = null;
  nuevaCofradia: any;
  cofradiaId: number = 0;
  listaCofradiasFiltrada: any[] = []; // lista filtrada de cofradías
  listaEventosFiltrada: any[] = []; // lista filtrada
  mostrarBotonFavoritosScroll: boolean = false; // 🔹 Controla si el botón de favs flota

  cofradiasAdmin: any[] = [];

  mostrarPopup = false;
  popupExito = false;
  inputPassword = '';
  showAdminPassword: boolean = false;
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

  masDeUnDia: boolean = false;

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

    const cofradiaId = this.cofradias.find((c) => c.nombre === this.usuario.name)?.id || 0;
    const nombre = (document.getElementById('name') as HTMLInputElement).value;
    const fechaInicio = (document.getElementById('fecha') as HTMLInputElement).value;
    const fechaFin = (document.getElementById('fechaFinal') as HTMLInputElement)?.value; //puede ser null si no se selecciona
    const hora = (document.getElementById('hora') as HTMLInputElement).value;
    const detalles = (document.getElementById('detalles') as HTMLInputElement).value;
    const lugar = (document.getElementById('lugar') as HTMLInputElement).value;

    if (!nombre || !fechaInicio || !hora || !lugar) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    let fechas: string[] = [fechaInicio];

    // Si se ha seleccionado "más de un día" y hay una fecha final válida
    if (this.masDeUnDia && fechaFin && fechaFin !== fechaInicio) {
      const start = new Date(fechaInicio);
      const end = new Date(fechaFin);

      // Cálculo de la diferencia en días
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días

      if (diffDays <= 0) {
        alert('La fecha final debe ser posterior a la de inicio.');
        return;
      }

      if (diffDays > 8) {
        alert('Por seguridad, no se pueden crear rangos de más de 8 días de una vez.');
        return;
      }

      fechas = this.obtenerRangoFechas(fechaInicio, fechaFin);
    }

    // Crear eventos para cada fecha
    const observables = fechas.map(fecha => {
      const eventoData = { nombre, fecha, hora, cofradia: cofradiaId, detalles, lugar };
      return this.eventosService.crearEvento(eventoData);
    });

    let completados = 0;
    observables.forEach(obs => {
      obs.subscribe({
        next: () => {
          completados++;
          if (completados === observables.length) {
            alert(fechas.length > 1 ? `Se han creado ${fechas.length} eventos correctamente.` : 'Evento creado correctamente.');
            window.location.reload();
          }
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
          alert('Error al crear uno de los eventos del rango.');
        }
      });
    });
  }


  private obtenerRangoFechas(inicio: string, fin: string): string[] {
    const fechas = [];
    let current = new Date(inicio);
    const end = new Date(fin);
    while (current <= end) {
      fechas.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return fechas;
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

  // ----- S C R O L L   T R A C K I N G -----
  
  // Para móviles (scroll en window)
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.checkScroll(scrollOffset);
  }

  // Para PC (scroll en el div .contenedor-eventos)
  onDivScroll(event: any) {
    const scrollOffset = event.target.scrollTop;
    this.checkScroll(scrollOffset);
  }

  private checkScroll(offset: number) {
    // Si pasamos de 180px (lo que ocupan los filtros aprox), mostramos el botón
    this.mostrarBotonFavoritosScroll = offset > 180;
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

  setFechaInicio(event: any): void {
    this.fechaInicioFiltro = event.target.value || null;
    this.aplicarFiltros();
  }

  setFechaFin(event: any): void {
    this.fechaFinFiltro = event.target.value || null;
    this.aplicarFiltros();
  }


  aplicarFiltros(): void {
    this.eventos = this.todoslosEventos.filter(evento => {
      const fechaEv = new Date(evento.fecha).getTime();
      
      let coincideFecha = true;
      if (this.fechaInicioFiltro) {
        const init = new Date(this.fechaInicioFiltro).getTime();
        if (fechaEv < init) coincideFecha = false;
      }
      if (this.fechaFinFiltro) {
        const end = new Date(this.fechaFinFiltro).getTime();
        // sumamos un día al end para que incluya todo el día final
        const finalEnd = end + (24 * 60 * 60 * 1000);
        if (fechaEv > finalEnd) coincideFecha = false;
      }

      const coincideTitulo =
        !this.palabraFiltro || 
        evento.nombre.toLowerCase().includes(this.palabraFiltro) || 
        (this.cofradias.find(c => c.id === evento.cofradia)?.nombre.toLowerCase().includes(this.palabraFiltro)) ||
        (evento.lugar && evento.lugar.toLowerCase().includes(this.palabraFiltro));

      return coincideFecha && coincideTitulo;
    });
  }

  // ------ VALIDAR CONTRASEÑA Y CERRRAR POP UP-----

  validarPassword() {
    if (this.inputPassword === this.password) {
      this.mostrarPopup = false;
      this.popupExito = true;
      // Asegurar que las listas del admin tengan todos los datos al abrir
      this.listaEventosFiltrada = [...this.todoslosEventos];
      this.listaCofradiasFiltrada = [...this.cofradias];
    }
  }


  cerrarPopupExito() {
    this.mostrarPopup = false;
    this.popupExito = false;
  }

  // --- Crear o borrar cofradias ----

  eliminarCofradia(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cofradía?')) return;
    this.cofradiasService.eliminarCofradia(id).subscribe({
      next: (res) => {
        this.cofradias = this.cofradias.filter(c => c.id !== id);
        this.listaCofradiasFiltrada = [...this.cofradias]; // Sincronizar
        alert('Cofradía eliminada');
      },
      error: (err) => {
        console.error('Error al eliminar cofradía', err);
        alert('No se pudo eliminar la cofradía');
      }
    });
  }


  crearCofradia() {
    const nombreInput = document.getElementById('nombreCofradia') as HTMLInputElement;
    const nombre = nombreInput?.value.trim();

    if (!nombre) {
      alert('Debes ingresar un nombre');
      return;
    }

    const nueva: any = { nombre: nombre };

    this.cofradiasService.crearCofradia(nueva).subscribe({
      next: (res) => {
        this.cofradias.push(res.cofradia);
        this.listaCofradiasFiltrada = [...this.cofradias]; // Sincronizar
        if (nombreInput) nombreInput.value = ''; // Limpiar input
        alert('Cofradía creada correctamente');
      },
      error: (err) => {
        console.error('Error al crear cofradía', err);
        alert('No se pudo crear la cofradía');
      }
    });
  }

  // ---- ELIMINAR EVENTO ----
  eliminarEvento(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    this.eventosService.eliminarEvento(id).subscribe({
      next: (res) => {
        this.eventos = this.eventos.filter(e => e.id !== id);
        this.listaEventosFiltrada = [...this.eventos]; // Sincronizar
        alert('Evento eliminado');
      },
      error: (err) => {
        console.error('Error al eliminar evento', err);
        alert('No se pudo eliminar el evento');
      }
    });
  }

  filtrarEventos(event: any) {
    const valor = event.target.value.toLowerCase();

    this.listaEventosFiltrada = this.todoslosEventos.filter(evento => {
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
    event?.preventDefault();

    const nombre = (document.getElementById('nameAdmin') as HTMLInputElement)?.value;
    const fechaInicio = (document.getElementById('fechaAdmin') as HTMLInputElement)?.value;
    const hora = (document.getElementById('horaAdmin') as HTMLInputElement)?.value;
    const lugar = (document.getElementById('lugarAdmin') as HTMLInputElement)?.value;
    const detalles = (document.getElementById('detallesAdmin') as HTMLTextAreaElement)?.value;
    const cofradiaSelect = (document.getElementById('cofradiaAdmin') as HTMLSelectElement)?.value;

    if (!nombre || !fechaInicio || !hora || !lugar || !detalles || !cofradiaSelect) {
      alert('Falta un campo (todos los campos son obligatorios).');
      return;
    }

    let fechas: string[] = [fechaInicio];

    // Para el admin, podríamos necesitar un checkbox separado o reutilizar masDeUnDia
    // Por simplicidad y consistencia, vamos a asumir que masDeUnDia aplica a ambos si el UI lo permite
    // En el HTML actual, masDeUnDia es una propiedad del componente.

    // Buscar si hay un fechaFinalAdmin (lo añadiré en el HTML)
    const fechaFin = (document.getElementById('fechaFinalAdmin') as HTMLInputElement)?.value;
    if (this.masDeUnDia && fechaFin && fechaFin !== fechaInicio) {
      const start = new Date(fechaInicio);
      const end = new Date(fechaFin);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays <= 0) {
        alert('La fecha final debe ser posterior a la de inicio.');
        return;
      }

      if (diffDays > 8) {
        alert('No se pueden crear rangos de más de 8 días.');
        return;
      }

      fechas = this.obtenerRangoFechas(fechaInicio, fechaFin);
    }

    const observables = fechas.map(fecha => {
      const eventoData = { nombre, fecha, hora, lugar, detalles, cofradia: Number(cofradiaSelect) };
      return this.eventosService.crearEvento(eventoData);
    });

    let completados = 0;
    observables.forEach(obs => {
      obs.subscribe({
        next: () => {
          completados++;
          if (completados === observables.length) {
            alert(fechas.length > 1 ? `Se han creado ${fechas.length} eventos (Modo Admin).` : 'Evento creado correctamente.');
            window.location.reload();
          }
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
          alert('Hubo un error al crear uno de los eventos.');
        }
      });
    });

    // Limpiar campos (aunque el reload lo hará, es buena práctica)
    const fields = ['nameAdmin', 'fechaAdmin', 'horaAdmin', 'lugarAdmin', 'detallesAdmin', 'cofradiaAdmin', 'fechaFinalAdmin'];
    fields.forEach(id => {
      const el = document.getElementById(id) as any;
      if (el) el.value = '';
    });
  }



  toggleMasDeUnDia() {
    this.masDeUnDia = !this.masDeUnDia;
  }

  // Edición de eventos (Admin)
  editandoEvento: any = null;

  iniciarEdicion(evento: any) {
    this.editandoEvento = { ...evento };
    // Rellenamos el formulario de creación con los datos del evento a editar
    // Para simplificar, asumimos que se usa el mismo formulario o uno similar
    // Si queremos ser pro, podemos abrir un modal diferente o cambiar el modo del actual
    alert('Función de edición preparada para el evento: ' + evento.nombre);
  }

  guardarEdicion() {
    if (!this.editandoEvento) return;
    this.eventosService.editarEvento(this.editandoEvento.id, this.editandoEvento).subscribe({
      next: () => {
        alert('Evento actualizado correctamente');
        window.location.reload();
      },
      error: (err: any) => {
        console.error('Error al actualizar evento', err);
        alert('No se pudo actualizar el evento');
      }
    });
  }

  toggleAdminPopup() {
    this.popupExito = false;
  }
}

