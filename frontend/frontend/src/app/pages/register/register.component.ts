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
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('name', this.name);
    formData.append('password', this.password);
    formData.append('password_confirmation', this.password_confirmation);

    this.authService.register(formData).subscribe(
      (response) => {
        console.log('Registro exitoso:', response);
        alert(`Registrado como ${this.name}`);

        this.router.navigate(['/login']);
      },
      (error) => {

          alert(
            'Ocurrió un error al registrarse: ' + error.error.message ||
              'Error desconocido'
          );

      }
    );
  }
}
