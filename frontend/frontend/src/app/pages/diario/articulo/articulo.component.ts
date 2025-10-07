import { Component, input } from '@angular/core';
import { Input } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { DiarioService } from '../../../services/diario/diario.service';
import { Router } from '@angular/router';
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
  nombreUsuario: string = '';

  constructor(private authService : AuthService, private diarioService : DiarioService, private router : Router){}
  ngOnInit(): void {
    this.obtenerAutor();
    const usuario = this.authService.getUsuarioData(); // Obtiene el usuario desde localStorage
    if (usuario) {
      this.nombreUsuario = usuario.name;
    } else {
      // Si no hay usuario, asigna valores por defecto para que los botones no se muestren
      this.nombreUsuario = '';
    }
  }

  obtenerAutor(): void {
    if (this.articulo && this.usuarios.length) {
      const usuario = this.usuarios.find(
        (u) => u.id === this.articulo.id_autor
      );
      this.nombreAutor = usuario ? usuario.name : 'Desconocido';
    }
  }



  eliminarArticulo(articuloId : number) : void {
  this.diarioService.eliminarArticulo(articuloId).subscribe(() => {
        console.log(`Articulo ${articuloId} eliminado`);
        window.location.reload();
      });
  }

  editarArticulo(articuloId: number): void {
  this.router.navigate(['/editarArticulo', articuloId]);
}

}
