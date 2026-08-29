import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  codigo: string = '';
  esCofradia: boolean = false;
  showPassword: boolean = false;
  error: string = '';

  // Para reset de contraseña
  mostrarReset: boolean = false;
  emailReset: string = '';
  mensajeReset: string = '';
  errorReset: string = '';

  constructor(private authService: AuthService, private router: Router, private notificacionService: NotificacionService) { }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('codigo', this.codigo);

    this.authService.login(formData).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);

        // Si el backend devuelve { error: "..." }, mostramos el mensaje y detenemos todo
        if (response.error) {
          this.error = response.error;
          console.log('Error mostrado:', this.error);
          return;
        }

        // Si no hay token o estructura inesperada
        if (!response.data || !response.data.accessToken) {
          this.error = 'Error inesperado en la respuesta del servidor';
          return;
        }

        // Si llega aquí, el login fue correcto
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        this.notificacionService.exito(`Logeado como ${response.data.user.name}`);
        this.router.navigate(['/']).then(() => setTimeout(() => location.reload(), 1200));
      },
      (error) => {
        console.error('Error HTTP:', error);
        if (error.status === 401) {
          this.error = error.error?.error || 'Credenciales inválidas';
        } else if (error.status === 403) {
          this.error = error.error?.error || 'Código incorrecto';
        } else {
          this.error = 'Error de conexión con el servidor';
        }
      }

    );
  }



  mostrarFormularioReset() {
    this.mostrarReset = true;
  }

  // Método para solicitar el enlace de recuperación y enviar el correo
  solicitarReset() {
    if (!this.emailReset.trim()) {
      this.errorReset = 'Debes ingresar tu correo';
      return;
    }

    this.authService.sendResetLink(this.emailReset).subscribe({
      next: (res) => {
        this.mensajeReset = 'Se ha enviado un enlace de recuperación a tu correo';
        this.errorReset = '';
      },
      error: (err) => {
        console.error('Error al solicitar reset:', err);
        this.errorReset = err.error?.message || 'No se pudo enviar el enlace';
        this.mensajeReset = '';
      },
    });
  }
}
