import { Component, input } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-articulo',
  standalone: false,
  templateUrl: './articulo.component.html',
  styleUrl: './articulo.component.css',
})
export class ArticuloComponent {
  @Input() articulo: any; // Recibe el artículo desde el padre
  @Input() usuarios: any[] = []; // Recibe la lista de usuarios
  nombreAutor: string = 'Desconocido';

  ngOnInit(): void {
    this.obtenerAutor();
  }

  obtenerAutor(): void {
    if (this.articulo && this.usuarios.length) {
      const usuario = this.usuarios.find(
        (u) => u.id === this.articulo.id_autor
      );
      this.nombreAutor = usuario ? usuario.name : 'Desconocido';
    }
  }
}
