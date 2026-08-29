import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificacionService, Notificacion } from '../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-notificaciones',
  standalone: false,
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  private sub?: Subscription;

  constructor(private notificacionService: NotificacionService) { }

  ngOnInit(): void {
    this.sub = this.notificacionService.notificacion$.subscribe(n => {
      this.notificaciones.push(n);
      setTimeout(() => this.cerrar(n.id), 5000);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  cerrar(id: number): void {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
  }
}
