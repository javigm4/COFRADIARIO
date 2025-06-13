import { Component } from '@angular/core';
import {Evento } from '../../interfaces/agenda';
import { Input } from '@angular/core';
@Component({
  selector: 'app-lista-eventos',
  standalone: false,
  templateUrl: './lista-eventos.component.html',
  styleUrl: './lista-eventos.component.css'
})
export class ListaEventosComponent {
@Input() eventos: Evento[] = [];
@Input() esCofradia: boolean = false;
@Input() usuario: any = null;
  @Input() cofradias: any[] = [];

}
