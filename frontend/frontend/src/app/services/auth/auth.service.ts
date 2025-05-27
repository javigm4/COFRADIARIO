import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/login';
  private apiUrlRegister = 'http://127.0.0.1:8000/api/register';
  constructor(private http: HttpClient) {}

  // auth metodos
  login(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      withCredentials: true,
    }); //hacemos que postee el formdata al login del backend
  }

  register(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrlRegister, formData, {
      withCredentials: true,
    });
  }

  // get usuario
  getUsuario(): any {
    const token = localStorage.getItem('token'); // cojo el token almacenado
    if (token) {
      return token; // devovler token
    }
    return null;
  }

  getUsuarioData(): any {
    const userData = localStorage.getItem('user'); // obtener el usuario del token

    if (userData) {
      try {
        console.log(userData);
        return JSON.parse(userData); //convertimos a json y retornamos
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
        return null;
      }
    }
    return null;
  }

  enviarMensajeContacto(formData: any): Observable<any> {
    return this.http.post(
      'http://127.0.0.1:8000/api/enviar-mensaje-contacto',
      formData
    );
  }
}
