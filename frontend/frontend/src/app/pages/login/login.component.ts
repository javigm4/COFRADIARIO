import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
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
  error: string = '';

  // Para reset de contraseña
  mostrarReset: boolean = false;
  emailReset: string = '';
  mensajeReset: string = '';
  errorReset: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('codigo', this.codigo);

    this.authService.login(formData).subscribe(
      (response) => {
        console.log('Login exitoso:', response);

        // Guardamos el token y los datos del usuario
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));


        alert(`Logeado como ${response.data.user.name}`);
        this.router.navigate(['/']).then(() => {
          location.reload(); // Esto evita bugs en Docker
        });
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this.error = 'Credenciales incorrectas';
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
