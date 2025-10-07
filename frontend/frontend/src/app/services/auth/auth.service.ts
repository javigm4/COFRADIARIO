import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = enviroment.backendApiKey + '/login';
  private apiUrlRegister = enviroment.backendApiKey + '/register';
  private apiAuth = enviroment.backendApiKey;


  constructor(private http: HttpClient) { }

  // auth metodos
  login(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData); //hacemos que postee el formdata al login del backend
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrlRegister, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
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
    return this.http.post(`${this.apiAuth}/enviar-mensaje-contacto`, formData);
  }

  sendResetLink(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiAuth}/password/forgot`, { email });
  }

  // Cambiar contraseña con token
  resetPassword(email: string, token: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post<any>(`${this.apiAuth}/password/reset`, {
      email,
      token,
      password,
      password_confirmation
    });
  }
}
