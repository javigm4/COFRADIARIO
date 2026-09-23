import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { NotificacionService } from '../services/notificacion/notificacion.service';

type Estado = 'confirmar' | 'verificando' | 'exito' | 'ya_verificado' | 'error';

@Component({
  selector: 'app-verificado',
  standalone: false,
  templateUrl: './verificado.component.html',
  styleUrl: './verificado.component.css'
})
export class VerificadoComponent implements OnInit {
  estado: Estado = 'error';
  private id: number | null = null;
  private token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const estadoParam = params.get('estado');
      const idParam = params.get('id');
      this.id = idParam ? Number(idParam) : null;

      const hash = window.location.hash || '';
      const match = hash.match(/token=([^&]+)/);
      this.token = match ? decodeURIComponent(match[1]) : '';

      if (estadoParam === 'confirmar' && this.id && this.token) {
        this.estado = 'confirmar';
      } else if (estadoParam === 'ya_verificado') {
        this.estado = 'ya_verificado';
      } else {
        this.estado = 'error';
      }
    });
  }

  confirmar(): void {
    if (!this.id || !this.token) return;
    this.estado = 'verificando';

    this.authService.confirmarVerificacion(this.id, this.token).subscribe({
      next: (response) => {
        if (response.token && response.usuario) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.usuario));
        }
        this.estado = 'exito';
        this.notificacionService.exito('Cuenta verificada correctamente.');
        setTimeout(() => {
          this.router.navigate(['/inicio']).then(() => location.reload());
        }, 1500);
      },
      error: () => {
        this.estado = 'error';
        this.notificacionService.error('El enlace no es válido o ha expirado.');
      }
    });
  }
}
