import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CofradiasService } from '../../../services/cofradias/cofradias.service';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-cofradia',
  standalone: false,
  templateUrl: './cofradia.component.html',
  styleUrl: './cofradia.component.css',
})
export class CofradiaComponent implements OnInit {
  cargando = true;
  noEncontrada = false;

  cofradia: any = null;
  proximosEventos: any[] = [];
  titulares: { nombre: string; foto_url: string }[] = [];

  historiaAbierta = false;
  videoEmbedUrl: SafeResourceUrl | null = null;

  contactoNombre = '';
  contactoEmail = '';
  contactoMensaje = '';
  contactoEnviando = false;
  contactoEnviado = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cofradiasService: CofradiasService,
    private notificacionService: NotificacionService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.noEncontrada = true;
      this.cargando = false;
      return;
    }

    this.cofradiasService.obtenerPerfil(id).subscribe({
      next: (res) => {
        this.cofradia = res.cofradia;
        this.proximosEventos = res.proximos_eventos || [];
        this.titulares = (this.cofradia.titulares || [])
          .map((t: any) => (typeof t === 'string' ? { nombre: t, foto_url: '' } : { nombre: t?.nombre || '', foto_url: t?.foto_url || '' }))
          .filter((t: { nombre: string; foto_url: string }) => !!t.nombre);
        this.videoEmbedUrl = this.construirEmbedYoutube(this.cofradia.video_url);
        this.cargando = false;
      },
      error: () => {
        this.noEncontrada = true;
        this.cargando = false;
      }
    });
  }

  private construirEmbedYoutube(url: string | null): SafeResourceUrl | null {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|v=|\/embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (!match) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${match[1]}`);
  }

  horaEvento(fecha: string): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  irAAgenda(eventoId: number): void {
    this.router.navigate(['/agenda'], { queryParams: { evento: eventoId } });
  }

  enviarContacto(): void {
    if (!this.cofradia?.id || !this.contactoNombre || !this.contactoEmail || !this.contactoMensaje) {
      this.notificacionService.error('Rellena todos los campos del formulario de contacto.');
      return;
    }

    this.contactoEnviando = true;
    this.cofradiasService.enviarContacto(this.cofradia.id, {
      nombre: this.contactoNombre,
      email: this.contactoEmail,
      mensaje: this.contactoMensaje,
    }).subscribe({
      next: () => {
        this.contactoEnviando = false;
        this.contactoEnviado = true;
        this.notificacionService.exito('Mensaje enviado correctamente.');
      },
      error: (err) => {
        this.contactoEnviando = false;
        this.notificacionService.error(err.error?.message || 'No se pudo enviar el mensaje.');
      }
    });
  }
}
