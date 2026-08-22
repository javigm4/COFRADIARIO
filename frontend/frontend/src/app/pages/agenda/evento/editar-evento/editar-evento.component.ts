import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventosService } from '../../../../services/eventos/eventos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-evento',
  standalone: false,
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent implements OnInit {
  evento: any = null;

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const eventoId = this.route.snapshot.paramMap.get('id');
    if (eventoId) {
      this.eventosService.obtenerEvento(+eventoId).subscribe({
        next: (response) => {
          // Si el backend devuelve { evento: {...} }, lo extraemos
          this.evento = response.evento || response;
        },
        error: (err) => console.error('Error al obtener el evento:', err)
      });
    }
  }

  guardarCambios(): void {
    if (!this.evento) return;
    this.eventosService.editarEvento(this.evento.id, this.evento).subscribe({
      next: () => {
        this.router.navigate(['/agenda']);
      },
      error: (err) => console.error('Error al actualizar el evento:', err)
    });
  }
}
