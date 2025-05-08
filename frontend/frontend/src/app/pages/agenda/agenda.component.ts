import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service'; // Importar el servicio de eventos
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone:false
})
export class AgendaComponent implements OnInit {
  eventos: any[] = []; // Almacena los eventos
  cofradias: any[] = []; // Almacena las cofradías y sus datos

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    // Obtener los eventos al cargar la agenda
    this.eventosService.getEventos().subscribe(
      (response) => {
        this.eventos = response.eventos; // Extrae eventos del JSON
        this.cofradias = response.cofradias; // Extrae cofradías del JSON
      },
      (error) => {
        console.error('Error al obtener los eventos:', error);
      }
    );
  }
}
