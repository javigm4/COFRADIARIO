import { Component } from '@angular/core';
import {Evento } from '../../interfaces/agenda'; // Importar la interfaz Evento
import { Input } from '@angular/core'; // Importar Input desde Angular core
@Component({
  selector: 'app-lista-eventos',
  standalone: false,
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css'
})
export class ListaEventosComponent {
@Input() eventos: Evento[] = [];
@Input() esCofradia: boolean = false;
@Input() usuario: any = null;  // ✅ Inicializar como `null`, no `{}`.
  @Input() cofradias: any[] = []; // Recibe la lista de cofradías

}
