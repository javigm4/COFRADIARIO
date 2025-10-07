import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiarioService } from '../../../../services/diario/diario.service';
import { Router } from '@angular/router'; // Importar Router para la navegación

@Component({
  selector: 'app-editar-articulo',
  standalone: false,
  templateUrl: './editar-articulo.component.html',
  styleUrl: './editar-articulo.component.css',
})
export class EditarArticuloComponent {
// Propiedad que contendrá los datos del artículo
  articulo: any = {};

  constructor(
    private route: ActivatedRoute,
    private diarioService: DiarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtiene el ID del artículo desde la URL
    const articuloId = this.route.snapshot.paramMap.get('id');
    if (articuloId) {
      this.diarioService.obtenerArticulo(+articuloId).subscribe(
        (response) => {
          this.articulo = response;
        },
        (error) => {
          console.error('Error al obtener el artículo:', error);
        }
      );
    } else {
      console.error('No se encontró el ID del artículo en la ruta.');
    }
  }

  // Se ejecuta al hacer clic en "Guardar cambios"
  guardarCambios(): void {
    this.diarioService.editarArticulo(this.articulo.id, this.articulo).subscribe(
      (response) => {
        console.log('Artículo actualizado:', response);
        // Redirige a la lista de artículos
        this.router.navigate(['/diario']);
      },
      (error) => {
        console.error('Error al actualizar el artículo:', error);
      }
    );
  }



}
