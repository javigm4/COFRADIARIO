import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-lista-articulos',
  standalone: false,
  templateUrl: './lista-articulos.component.html',
  styleUrl: './lista-articulos.component.css'
})
export class ListaArticulosComponent {
  @Input() articulos: any[] = []; // Recibe los artículos desde el componente padre
  @Input() usuarios: any[] = []; // Recibe la lista de usuarios desde el padre

}
