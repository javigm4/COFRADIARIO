import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private http: HttpClient, private router: Router) {}
  menuAbierto: boolean = false;

  cerrarSesion(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    this.http
      .post(
        'http://127.0.0.1:8000/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )
      .subscribe(
        () => {
          localStorage.clear();
          alert('Deslogeado exitosamente');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error al cerrar sesión', error);
        }
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

  // Añade este método
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
