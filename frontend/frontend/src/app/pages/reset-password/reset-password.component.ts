import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false, // <--- aquí

})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  email!: string;
  password!: string;
  passwordConfirm!: string;
  mensaje = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  resetPassword() {
    if (!this.password || !this.passwordConfirm) {
      this.error = 'Introduce ambas contraseñas';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.authService
      .resetPassword(this.email, this.token, this.password, this.passwordConfirm)
      .subscribe({
        next: (res) => {
          this.mensaje = 'Contraseña cambiada correctamente';
          this.error = '';
          // Redirigir al login tras éxito
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.message || 'No se pudo cambiar la contraseña';
          this.mensaje = '';
        }
      });
  }
}
