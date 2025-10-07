import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
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

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.nombre || !this.email || !this.mensaje) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const formData = {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje,
    };

    this.authService.enviarMensajeContacto(formData).subscribe(
      () => {
        alert('Mensaje enviado correctamente.');
        this.nombre = '';
        this.email = '';
        this.mensaje = '';
      },
      (error) => {
        alert('Error al enviar el mensaje.');
        console.error(error);
      }
    );
  }
}
