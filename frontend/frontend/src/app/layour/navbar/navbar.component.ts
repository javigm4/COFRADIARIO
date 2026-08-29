import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificacionService } from '../../services/notificacion/notificacion.service';

const EMAILS_GESTION = ['diariodelasbandas@gmail.com', 'cofradiariodemalaga@gmail.com'];

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

  constructor(private http: HttpClient, private router: Router, private notificacionService: NotificacionService) {}

  ngOnInit() {
    this.verificarAutenticacion(); // Verificar autenticación al iniciar
  }

  verificarAutenticacion() {
    this.usuarioAutenticado = !!localStorage.getItem('token');

    try {
      const userData = localStorage.getItem('user');
      const usuario = userData ? JSON.parse(userData) : null;
      this.esAdminGestion = !!usuario?.email && EMAILS_GESTION.includes(usuario.email);
    } catch {
      this.esAdminGestion = false;
    }
  }

  cerrarSesion(): void {
    if (!this.usuarioAutenticado) return; // Evita ejecutar si no hay usuario autenticado

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    this.http
      .post('https://cofradiario.es/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      })
      .subscribe(
        () => {
          localStorage.clear();
          this.usuarioAutenticado = false; // Se actualiza el estado
          this.notificacionService.exito('Deslogeado exitosamente');
          this.router.navigate(['/login']);
        },
        (error) => console.error('Error al cerrar sesión', error)
      );
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
