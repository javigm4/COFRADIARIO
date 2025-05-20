import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiarioService } from '../../services/diario/diario.service'; // Importa el servicio
import { AuthService } from '../../services/auth/auth.service'; // Importa el servicio de autenticación
@Component({
  selector: 'app-diario',
  standalone: false,
  templateUrl: './diario.component.html',
  styleUrl: './diario.component.css',
})
export class DiarioComponent {
 articulos: any[] = [];
  usuarios: any[] = [];
  usuario: any;
  esUsuario: boolean = false;
  esCofradia: boolean = false;

  constructor(private http: HttpClient, private diarioService: DiarioService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getUsuarioData();
    this.getArticulos();
  }

  getUsuarioData(): void {
    const usuario = this.authService.getUsuarioData();

    if (usuario) {
      this.usuario = usuario;
      this.esUsuario = usuario.role === 'usuario';
      this.esCofradia = usuario.role === 'cofradia';
    }
  }

  getArticulos(): void {
    this.diarioService.getArticulos().subscribe(
      (response) => {
        this.articulos = response.articulos ?? [];
        this.usuarios = response.usuarios ?? [];
        console.log('Artículos cargados:', this.articulos);
      },
      (error) => {
        console.error('Error al obtener artículos:', error);
      }
    );
  }
}
