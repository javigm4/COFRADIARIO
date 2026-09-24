import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone: false,
})
export class AgendaComponent implements OnInit {
  eventos: any[] = [];
  cofradias: any[] = [];
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
  filtrosAbiertos: boolean = false; // 🔹 Controla el cajón de filtros deslizante
  eventoDestacado: number | null = null; // 🔹 Evento a abrir/resaltar al llegar desde el calendario
  mostrarModalCrearEvento: boolean = false; // 🔹 Controla el pop up de "Crear Nuevo Evento"
  modoEdicionEvento: boolean = false; // 🔹 true = el pop up está editando un evento existente
  eventoEditandoId: number | null = null;
  eventoEditandoCofradiaId: number | null = null;
  formEvento = {
    nombre: '',
    fechaInicio: '',
    fechaFinal: '',
    hora: '',
    lugar: '',
    detalles: ''
  };

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
    private route: ActivatedRoute,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioData(); //  Obtener el usuario desde `localStorage`

    if (usuario) {
      this.usuario = usuario;
      this.esCofradia = usuario.role === 'cofradia';
    }

    const eventoParam = this.route.snapshot.queryParamMap.get('evento');
    this.eventoDestacado = eventoParam ? Number(eventoParam) : null;

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
        this.todoslosEventos = [...this.eventos]; // copia los eventos originales (con esto copiamos el contenido del array, no la referencia al array , que ocurre si hacemos this.todoslosEventos = this.eventos)
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

  // ----- P O P   U P   C R E A R / E D I T A R   E V E N T O -----
  abrirModalCrear(): void {
    this.modoEdicionEvento = false;
    this.eventoEditandoId = null;
    this.masDeUnDia = false;
    this.formEvento = { nombre: '', fechaInicio: '', fechaFinal: '', hora: '', lugar: '', detalles: '' };
    this.mostrarModalCrearEvento = true;
  }

  abrirModalEditar(evento: any): void {
    const fecha = new Date(evento.fecha);
    this.modoEdicionEvento = true;
    this.eventoEditandoId = evento.id;
    this.eventoEditandoCofradiaId = evento.cofradia;
    this.masDeUnDia = false;
    this.formEvento = {
      nombre: evento.nombre,
      fechaInicio: this.aFechaInput(fecha),
      fechaFinal: '',
      hora: this.aHoraInput(fecha),
      lugar: evento.lugar || '',
      detalles: evento.detalles || ''
    };
    this.mostrarModalCrearEvento = true;
  }

  cerrarModalEvento(): void {
    this.mostrarModalCrearEvento = false;
    this.modoEdicionEvento = false;
    this.eventoEditandoId = null;
    this.eventoEditandoCofradiaId = null;
  }

  private aFechaInput(fecha: Date): string {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  }

  private aHoraInput(fecha: Date): string {
    return `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
  }

  actualizarEvento(): void {
    if (!this.eventoEditandoId) return;
    const { nombre, fechaInicio, hora, lugar, detalles } = this.formEvento;

    if (!nombre || !fechaInicio || !hora || !lugar) {
      this.notificacionService.error('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    const eventoData = {
      nombre,
      fecha: `${fechaInicio} ${hora}:00`,
      hora,
      lugar,
      detalles,
      cofradia: this.eventoEditandoCofradiaId
    };

    this.eventosService.editarEvento(this.eventoEditandoId, eventoData).subscribe({
      next: () => {
        this.notificacionService.exito('Evento actualizado correctamente.');
        this.cerrarModalEvento();
        this.cargarDatos();
      },
      error: (error) => {
        console.error('Error al actualizar el evento:', error);
        this.notificacionService.error('Error al actualizar el evento.');
      }
    });
  }

  // ----- C R E A R   E V E N T O -----
  crearEvento(): void {
    if (!this.esCofradia) {
      this.notificacionService.error('Solo una cofradía puede crear eventos.');
      return;
    }

    const cofradiaId = this.cofradias.find((c) => c.nombre === this.usuario.name)?.id || 0;
    const { nombre, fechaInicio, fechaFinal: fechaFin, hora, lugar, detalles } = this.formEvento;

    if (!nombre || !fechaInicio || !hora || !lugar) {
      this.notificacionService.error('Por favor, rellena todos los campos obligatorios.');
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
        this.notificacionService.error('La fecha final debe ser posterior a la de inicio.');
        return;
      }

      if (diffDays > 8) {
        this.notificacionService.error('Por seguridad, no se pueden crear rangos de más de 8 días de una vez.');
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
            this.notificacionService.exito(fechas.length > 1 ? `Se han creado ${fechas.length} eventos correctamente.` : 'Evento creado correctamente.');
            this.cerrarModalEvento();
            this.cargarDatos();
          }
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
          this.notificacionService.error('Error al crear uno de los eventos del rango.');
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


  // ----- C A J Ó N   D E   F I L T R O S -----
  toggleFiltros(): void {
    this.filtrosAbiertos = !this.filtrosAbiertos;
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

  toggleMasDeUnDia() {
    this.masDeUnDia = !this.masDeUnDia;
  }
}

