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
  aceptaPolitica: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  mostrarAvisoCofradia: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    const formData = {
      email: this.email,
      name: this.name,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };


    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.errors) { // si el backend mandó errores dentro del body
          Object.keys(response.errors).forEach(campo => {
            alert(response.errors[campo][0]);
          });
        } else {
          alert(`Registrado como ${this.name}`);
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        alert('Ocurrió un error: ' + (error.message || 'desconocido'));
      }
    });
  }

  toggleAvisoCofradia(): void {
    this.mostrarAvisoCofradia = !this.mostrarAvisoCofradia;
  }
}
