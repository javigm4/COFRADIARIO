import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
@Component({
  selector: 'app-contacto',
  standalone: false,
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  nombre = '';
  email = '';
  mensaje = '';

  constructor(private authService: AuthService, private notificacionService: NotificacionService) {}

  onSubmit(): void {
    if (!this.nombre || !this.email || !this.mensaje) {
      this.notificacionService.error('Por favor, completa todos los campos.');
      return;
    }

    const formData = {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje,
    };

    this.authService.enviarMensajeContacto(formData).subscribe(
      () => {
        this.notificacionService.exito('Mensaje enviado correctamente.');
        this.nombre = '';
        this.email = '';
        this.mensaje = '';
      },
      (error) => {
        this.notificacionService.error('Error al enviar el mensaje.');
        console.error(error);
      }
    );
  }
}
