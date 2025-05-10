import { Component } from '@angular/core';
import { Favorito } from '../../../interfaces/agenda';
import { Input } from '@angular/core';
import { Evento } from '../../../interfaces/agenda';
import { Cofradia } from '../../../interfaces/agenda';
@Component({
  selector: 'app-listafavoritos',
  standalone: false,
  templateUrl: './listafavoritos.component.html',
  styleUrl: './listafavoritos.component.css',
})
export class ListafavoritosComponent {
  @Input()
  public favoritos: Favorito[] = []; // Array de libros
  @Input()
  public eventos: Evento[] = []; // Almacena los eventos
  @Input()
  public cofradias: Cofradia[] = []; // Almacena las cofradías y sus datos

  onEliminar(favoritoId: number): void {
    console.log('Eliminar favorito con ID:', favoritoId);
    this.favoritos = this.favoritos.filter((f) => f.id !== favoritoId);
  }
}
