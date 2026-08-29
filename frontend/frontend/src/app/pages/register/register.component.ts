import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  tipoRegistro: 'usuario' | 'cofradia' = 'usuario';
  email: string = '';
  name: string = '';
  password: string = '';
  password_confirmation: string = '';
  localidad: string = '';
  aceptaPolitica: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  mostrarAvisoCofradia: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router, private notificacionService: NotificacionService) { }

  seleccionarTipo(tipo: 'usuario' | 'cofradia'): void {
    this.tipoRegistro = tipo;
  }

  onSubmit(): void {
    const formData: any = {
      email: this.email,
      name: this.name,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    if (this.tipoRegistro === 'cofradia') {
      formData.localidad = this.localidad;
    }


    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.errors) { // si el backend mandó errores dentro del body
          Object.keys(response.errors).forEach(campo => {
            this.notificacionService.error(response.errors[campo][0]);
          });
        } else {
          this.notificacionService.exito(`Registrado como ${this.name}`);
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.notificacionService.error('Ocurrió un error: ' + (error.message || 'desconocido'));
      }
    });
  }

  toggleAvisoCofradia(): void {
    this.mostrarAvisoCofradia = !this.mostrarAvisoCofradia;
  }
}
