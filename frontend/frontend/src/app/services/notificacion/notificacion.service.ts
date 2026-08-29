import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notificacion {
  id: number;
  tipo: 'exito' | 'error';
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private idCounter = 0;
  private subject = new Subject<Notificacion>();
  notificacion$ = this.subject.asObservable();

  exito(mensaje: string): void {
    this.emitir(mensaje, 'exito');
  }

  error(mensaje: string): void {
    this.emitir(mensaje, 'error');
  }

  private emitir(mensaje: string, tipo: 'exito' | 'error'): void {
    this.subject.next({ id: ++this.idCounter, tipo, mensaje });
  }
}
