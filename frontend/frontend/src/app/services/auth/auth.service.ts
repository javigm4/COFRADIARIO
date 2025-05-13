import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login'; // 🔹 URL de tu backend

  constructor(private http: HttpClient) {}

  login(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      withCredentials: true,
    }); //hacemos que postee el formdata al login del backend
  }

  getUsuario(): any {
    const token = localStorage.getItem('token'); // 📌 Obtiene el token almacenado
    if (token) {
      return token; // 📌 Devuelve directamente el token sin parsearlo
    }
    return null;
  }


  getUsuarioData() : any {
    const userData = localStorage.getItem('user'); // 📌 Obtiene los datos del usuario almacenados

  if (userData) {
    try {
      console.log(userData);
      return JSON.parse(userData); // 📌 Convierte el JSON en objeto y lo retorna
    } catch (error) {
      console.error('Error al parsear los datos del usuario:', error);
      return null;
    }
  }

  return null;
  }
}
