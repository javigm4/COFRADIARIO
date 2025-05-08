import { Component } from '@angular/core';
import { Evento } from '../../interfaces/agenda';
import { Input } from '@angular/core'; // Importar Input desde Angular core
import { EventosService } from '../../../services/eventos/eventos.service'; // Importar el servicio de eventos
@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent {
  @Input()
  public evento !: Evento;

  cofradiaNombre: string = ''; // Almacena el nombre de la cofradía
  cofradias: any[] = []; // Lista de cofradías

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe(
      (response) => {
        this.cofradias = response.cofradias; // Guardamos las cofradías
        this.cofradiaNombre = this.obtenerCofradiaNombre(this.evento.cofradia);
      },
      (error) => {
        console.error('Error al obtener las cofradías:', error);
      }
    );
  }

  obtenerCofradiaNombre(cofradiaId: number): string {
    const cofradia = this.cofradias.find(c => c.id === cofradiaId);
    return cofradia ? cofradia.nombre : 'Desconocida'; // Retorna el nombre o 'Desconocida' si no se encuentra
  }// Inicializa la propiedad eventos como un arreglo vacío

}
