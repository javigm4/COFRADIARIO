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
  @Input()
  public eventos: Evento[] = []; // Array de libros

}
