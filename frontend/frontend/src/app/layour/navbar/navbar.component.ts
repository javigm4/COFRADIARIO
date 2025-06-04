import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  menuAbierto: boolean = false;
  usuarioAutenticado: boolean = false; // Inicializado como falso

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.verificarAutenticacion(); // Verificar autenticación al iniciar
  }

  verificarAutenticacion() {
    this.usuarioAutenticado = !!localStorage.getItem('token'); // Actualiza el estado
  }

  cerrarSesion(): void {
    if (!this.usuarioAutenticado) return; // Evita ejecutar si no hay usuario autenticado

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    this.http
      .post('http://51.68.70.108:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      })
      .subscribe(
        () => {
          localStorage.clear();
          this.usuarioAutenticado = false; // Se actualiza el estado
          alert('Deslogeado exitosamente');
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
