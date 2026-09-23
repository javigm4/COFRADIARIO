import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const usuario = this.authService.getUsuarioData();
    if (usuario?.is_admin) {
      return true;
    }
    this.router.navigate(['/inicio']);
    return false;
  }
}
