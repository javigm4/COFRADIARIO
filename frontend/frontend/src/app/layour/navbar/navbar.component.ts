import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { CofradiasService } from '../../services/cofradias/cofradias.service';
import { enviroment } from '../../../enviroments/enviroment';

const CLAVE_ALERTA_CERRADA = 'alertaPerfilCofradiaCerrada';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  menuAbierto: boolean = false;
  usuarioAutenticado: boolean = false;
  esAdminGestion: boolean = false;
  esCofradia: boolean = false;
  perfilAbierto: boolean = false;
  mostrarAlertaPerfil: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificacionService: NotificacionService,
    private cofradiasService: CofradiasService
  ) {}

  ngOnInit() {
    this.verificarAutenticacion(); // Verificar autenticación al iniciar
  }

  verificarAutenticacion() {
    this.usuarioAutenticado = !!localStorage.getItem('token');

    try {
      const userData = localStorage.getItem('user');
      const usuario = userData ? JSON.parse(userData) : null;
      this.esAdminGestion = !!usuario?.is_admin;
      this.esCofradia = usuario?.role === 'cofradia';
    } catch {
      this.esAdminGestion = false;
      this.esCofradia = false;
    }

    if (this.esCofradia) {
      this.comprobarPerfilVacio();
    }
  }

  private comprobarPerfilVacio(): void {
    let yaCerrada = false;
    try { yaCerrada = sessionStorage.getItem(CLAVE_ALERTA_CERRADA) === '1'; } catch { }
    if (yaCerrada) return;

    this.cofradiasService.obtenerMiCofradia().subscribe({
      next: (c) => {
        const sinTitulares = !c.titulares || c.titulares.filter((t: string) => !!t?.trim()).length === 0;
        const vacio = !c.historia?.trim() && sinTitulares && !c.escudo_url?.trim();
        this.mostrarAlertaPerfil = vacio;
      },
      error: () => { this.mostrarAlertaPerfil = false; }
    });
  }

  cerrarAlertaPerfil(): void {
    this.mostrarAlertaPerfil = false;
    try { sessionStorage.setItem(CLAVE_ALERTA_CERRADA, '1'); } catch { }
  }

  togglePerfil(): void {
    this.perfilAbierto = !this.perfilAbierto;
  }

  cerrarPerfil(): void {
    this.perfilAbierto = false;
  }

  cerrarSesion(): void {
    if (!this.usuarioAutenticado) return; // Evita ejecutar si no hay usuario autenticado

    const token = localStorage.getItem('token');

    // El cierre de sesión en el cliente NUNCA debe depender de que la petición
    // al servidor tenga éxito: si el token ya venció o hay un fallo de red,
    // el usuario debe poder salir igualmente (antes se quedaba "atascado").
    const finalizarSesion = () => {
      localStorage.clear();
      try { sessionStorage.removeItem(CLAVE_ALERTA_CERRADA); } catch { }
      this.usuarioAutenticado = false;
      this.esCofradia = false;
      this.esAdminGestion = false;
      this.mostrarAlertaPerfil = false;
      this.perfilAbierto = false;
      this.notificacionService.exito('Sesión cerrada correctamente.');
      this.router.navigate(['/login']);
    };

    if (!token) {
      finalizarSesion();
      return;
    }

    this.http
      .post(`${enviroment.backendApiKey}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      })
      .subscribe({
        next: finalizarSesion,
        error: (error) => {
          console.error('Error al cerrar sesión en el servidor (se cierra igualmente en el cliente):', error);
          finalizarSesion();
        }
      });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
 
    const divNav = document.getElementById('divNav');
    if (divNav) {
      divNav.classList.toggle('show', this.menuAbierto);
    }

    const btn = document.querySelector('.menu-toggle');
    if (btn) {
      btn.classList.toggle('rotate', this.menuAbierto);
    }
  }

  cerrarMenu() {
    this.menuAbierto = false;
    this.perfilAbierto = false;

    const divNav = document.getElementById('divNav');
    if (divNav) {
      divNav.classList.remove('show');
    } 

    const btn = document.querySelector('.menu-toggle');
    if (btn) {
      btn.classList.remove('rotate');
    }
  }
}
