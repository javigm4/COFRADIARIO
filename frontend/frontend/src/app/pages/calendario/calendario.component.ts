import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos/eventos.service';

interface CeldaCalendario {
  fecha: Date;
  numero: number;
  enMes: boolean;
  esHoy: boolean;
  eventos: any[];
}

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  eventos: any[] = [];
  cofradias: any[] = [];
  private eventosPorDia = new Map<string, any[]>();

  mesActual: Date = new Date();
  private hoy: Date = new Date();
  celdas: CeldaCalendario[] = [];

  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  private nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  diaSeleccionado: Date | null = null;
  eventosDelDia: any[] = [];
  modalVisible = false;

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe({
      next: (res) => {
        this.eventos = res.eventos ?? [];
        this.cofradias = res.cofradias ?? [];
        this.indexarEventos();
        this.generarMes();
      },
      error: (error) => {
        console.error('Error al obtener eventos:', error);
        this.generarMes();
      }
    });
  }

  private claveFecha(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dia}`;
  }

  private indexarEventos(): void {
    this.eventosPorDia.clear();
    this.eventos.forEach(e => {
      const fecha = new Date(e.fecha);
      if (isNaN(fecha.getTime())) return;
      const clave = this.claveFecha(fecha);
      if (!this.eventosPorDia.has(clave)) this.eventosPorDia.set(clave, []);
      this.eventosPorDia.get(clave)!.push(e);
    });
  }

  nombreCofradia(id: number): string {
    return this.cofradias.find(c => c.id === id)?.nombre || 'Cofradiario';
  }

  generarMes(): void {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();
    const primerDiaMes = new Date(año, mes, 1);

    // Lunes = 0 ... Domingo = 6 (semana española)
    const offset = (primerDiaMes.getDay() + 6) % 7;
    const inicioGrid = new Date(año, mes, 1 - offset);

    const claveHoy = this.claveFecha(this.hoy);
    const celdas: CeldaCalendario[] = [];

    for (let i = 0; i < 42; i++) {
      const fecha = new Date(inicioGrid);
      fecha.setDate(inicioGrid.getDate() + i);
      const clave = this.claveFecha(fecha);
      celdas.push({
        fecha,
        numero: fecha.getDate(),
        enMes: fecha.getMonth() === mes,
        esHoy: clave === claveHoy,
        eventos: this.eventosPorDia.get(clave) || []
      });
    }
    this.celdas = celdas;
  }

  get tituloMes(): string {
    return `${this.nombresMeses[this.mesActual.getMonth()]} ${this.mesActual.getFullYear()}`;
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarMes();
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarMes();
  }

  irAHoy(): void {
    this.mesActual = new Date();
    this.generarMes();
  }

  abrirDia(celda: CeldaCalendario): void {
    if (!celda.enMes) return;
    this.diaSeleccionado = celda.fecha;
    this.eventosDelDia = celda.eventos;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  get tituloDiaSeleccionado(): string {
    if (!this.diaSeleccionado) return '';
    const d = this.diaSeleccionado;
    return `${this.nombresDias[d.getDay()]}, ${d.getDate()} de ${this.nombresMeses[d.getMonth()]} de ${d.getFullYear()}`;
  }

  horaEvento(fecha: string): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  irAEvento(evento: any): void {
    this.modalVisible = false;
    this.router.navigate(['/agenda'], { queryParams: { evento: evento.id } });
  }
}
