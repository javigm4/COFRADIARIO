import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../../../services/eventos/eventos.service'; // Importar el servicio de eventos
import { Router } from '@angular/router'; // Importar Router para la navegación
@Component({
  selector: 'app-editar-evento',
  standalone: false,
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent {
evento: any = {};  // Almacenará los datos del evento

  constructor(private route: ActivatedRoute, private eventosService: EventosService, private router : Router) {}

  ngOnInit(): void {
    const eventoId = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la URL
    if (eventoId) {
      this.eventosService.obtenerEvento(+eventoId).subscribe(
        (response) => {
          this.evento = response;
        },
        (error) => {
          console.error('Error al obtener el evento:', error);
        }
      );
    }
  }

  guardarCambios(): void {
    this.eventosService.editarEvento(this.evento.id, this.evento).subscribe(
      (response) => {
        console.log('Evento actualizado:', response);
        this.router.navigate(['/agenda']); // Redirige a la lista de eventos después de editar
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
      }
    );
  }
}
