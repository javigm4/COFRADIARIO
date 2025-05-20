import { Component } from '@angular/core';
import { DiarioService } from '../../../../services/diario/diario.service';
import { Router } from '@angular/router'; // Importar Router para la navegación
@Component({
  selector: 'app-crear-articulo',
  standalone: false,
  templateUrl: './crear-articulo.component.html',
  styleUrl: './crear-articulo.component.css',
})
export class CrearArticuloComponent {
  nuevoArticulo: any = {};

  constructor(private diarioService: DiarioService, private router: Router) {}

  crearArticulo(): void {
    if (!this.nuevoArticulo.titular || !this.nuevoArticulo.cuerpo) {
      console.error('Debe completar todos los campos');
      return;
    }

    // Obtener el usuario actual de localStorage (ajústalo según tu implementación)
    const usuario = JSON.parse(localStorage.getItem('user') || '{}');

    // Agregar id_autor al objeto antes de enviarlo
    this.nuevoArticulo.id_autor = usuario.id;

    console.log('Datos enviados:', this.nuevoArticulo);

    this.diarioService.crearArticulo(this.nuevoArticulo).subscribe(
      (response) => {
        console.log('Artículo creado:', response);
        this.router.navigate(['/diario']);
      },
      (error) => {
        console.error('Error al crear el artículo:', error);
      }
    );
  }
}
