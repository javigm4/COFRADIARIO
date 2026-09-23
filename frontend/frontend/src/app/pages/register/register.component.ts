import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UbicacionesService } from '../../services/ubicaciones/ubicaciones.service';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  email: string = '';
  name: string = '';
  password: string = '';
  password_confirmation: string = '';
  aceptaPolitica: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  error: string = '';

  tipoRegistro: 'usuario' | 'cofradia' = 'usuario';
  provincias: string[] = [];
  municipios: string[] = [];
  provincia: string = '';
  localidad: string = '';

  registroCompletado: boolean = false;
  correoRegistrado: string = '';

  constructor(
    private authService: AuthService,
    private ubicacionesService: UbicacionesService,
    private router: Router,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit(): void {
    this.ubicacionesService.obtenerProvincias().subscribe(provincias => {
      this.provincias = provincias;
    });
  }

  seleccionarTipo(tipo: 'usuario' | 'cofradia'): void {
    this.tipoRegistro = tipo;
  }

  onProvinciaChange(): void {
    this.localidad = '';
    this.municipios = [];
    if (!this.provincia) return;
    this.ubicacionesService.obtenerMunicipios(this.provincia).subscribe(municipios => {
      this.municipios = municipios;
    });
  }

  onSubmit(): void {
    if (this.tipoRegistro === 'cofradia' && (!this.provincia || !this.localidad)) {
      this.notificacionService.error('Selecciona la provincia y la localidad de tu cofradía.');
      return;
    }

    const formData: any = {
      email: this.email,
      name: this.name,
      password: this.password,
      password_confirmation: this.password_confirmation,
      role: this.tipoRegistro,
    };

    if (this.tipoRegistro === 'cofradia') {
      formData.provincia = this.provincia;
      formData.localidad = this.localidad;
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.errors) { // si el backend mandó errores dentro del body
          Object.keys(response.errors).forEach(campo => {
            this.notificacionService.error(response.errors[campo][0]);
          });
        } else {
          this.registroCompletado = true;
          this.correoRegistrado = response.email || this.email;
        }
      },
      error: (error) => {
        if (error.status === 422 && error.error?.errors) {
          Object.keys(error.error.errors).forEach(campo => {
            this.notificacionService.error(error.error.errors[campo][0]);
          });
        } else {
          this.notificacionService.error('Ocurrió un error: ' + (error.message || 'desconocido'));
        }
      }
    });
  }
}
