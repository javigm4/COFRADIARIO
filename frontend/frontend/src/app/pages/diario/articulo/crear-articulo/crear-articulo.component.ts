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
    alert('Debe completar todos los campos');
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('user') || '{}');
  this.nuevoArticulo.id_autor = usuario.id;

  console.log('Datos enviados:', this.nuevoArticulo);

  this.diarioService.crearArticulo(this.nuevoArticulo).subscribe(
    (response) => {
      console.log('Artículo creado:', response);
      this.router.navigate(['/diario']);
    },
    (error) => {
      if (error.status === 403 && error.error.message) {
        alert(error.error.message);
      } else if (error.status === 401) {
        alert('No estás autenticado. Por favor, revisa tu correo electrónico para verificar tu cuenta.');
      } else {
        alert('Error inesperado al crear el artículo.');
      }

      console.error('Error al crear el artículo:', error);
    }
  );
}

}
