import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  name: string = '';
  password: string = '';
  password_confirmation: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const formData = {
      email: this.email,
      name: this.name,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    this.authService.register(formData).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);
        alert(`Registrado como ${this.name}`);

        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al registrar:', error);

        if (error.status === 422 && error.error.errors) {
          const errores = error.error.errors;
          const primerError = Object.values(errores)[0] as string[];
          alert('Ocurrió un error al registrarse: ' + primerError[0]);
        } else {
          alert(
            'Ocurrió un error al registrarse: ' +
              (error.error?.message || error.message || 'Error desconocido')
          );
        }
      }
    );
  }
}
