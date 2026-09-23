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
  showPassword: boolean = false;
  error: string = '';
  pendienteVerificar: boolean = false;
  reenviando: boolean = false;

  // Para reset de contraseña
  mostrarReset: boolean = false;
  emailReset: string = '';
  mensajeReset: string = '';
  errorReset: string = '';

  constructor(private authService: AuthService, private router: Router, private notificacionService: NotificacionService) { }

  onSubmit(): void {
    this.pendienteVerificar = false;
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);

    this.authService.login(formData).subscribe(
      (response) => {
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
        } else if (error.status === 403 && error.error?.pendiente_verificar) {
          this.error = error.error?.error || 'Debes verificar tu correo antes de iniciar sesión.';
          this.pendienteVerificar = true;
        } else {
          this.error = 'Error de conexión con el servidor';
        }
      }

    );
  }

  reenviarVerificacion(): void {
    if (!this.email) return;
    this.reenviando = true;
    this.authService.reenviarVerificacion(this.email).subscribe({
      next: () => {
        this.reenviando = false;
        this.notificacionService.exito('Si el correo existe y aún no está verificado, recibirás un nuevo enlace en breve.');
      },
      error: () => {
        this.reenviando = false;
        this.notificacionService.error('No se pudo reenviar el correo. Inténtalo de nuevo.');
      }
    });
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
