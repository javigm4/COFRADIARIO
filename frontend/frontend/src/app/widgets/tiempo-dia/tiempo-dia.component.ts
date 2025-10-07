import { Component } from '@angular/core';
import { TiempoDia } from '../interfaces/tiempo-dia.interface'; // Importar la interfaz TiempoDia
import { Input } from '@angular/core'; // Importar Input desde Angular core
@Component({
  selector: 'app-tiempo-dia',
  standalone: false,
  templateUrl: './tiempo-dia.component.html',
  styleUrl: './tiempo-dia.component.css'
})
export class TiempoDiaComponent {
  @Input()
  public dia !: TiempoDia;

}
