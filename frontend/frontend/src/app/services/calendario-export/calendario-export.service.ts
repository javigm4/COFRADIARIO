import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarioExportService {

  private esApple(): boolean {
    const ua = navigator.userAgent || '';
    const esIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
    const esMac = /Macintosh/.test(ua) && !esIOS;
    return esIOS || esMac;
  }

  private aFechaUTC(fecha: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${fecha.getUTCFullYear()}${pad(fecha.getUTCMonth() + 1)}${pad(fecha.getUTCDate())}T${pad(fecha.getUTCHours())}${pad(fecha.getUTCMinutes())}00Z`;
  }

  /** Añade el evento al calendario del usuario: Apple Calendar (.ics) en iOS/Mac, Google Calendar en el resto. */
  agregar(evento: { nombre: string; fecha: string; lugar?: string; detalles?: string }, cofradiaNombre?: string): void {
    const inicio = new Date(evento.fecha);
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000); // duración estimada: 1 hora
    const titulo = cofradiaNombre ? `${evento.nombre} · ${cofradiaNombre}` : evento.nombre;
    const descripcion = evento.detalles || '';
    const lugar = evento.lugar || '';

    if (this.esApple()) {
      this.descargarIcs(titulo, inicio, fin, descripcion, lugar);
    } else {
      this.abrirGoogleCalendar(titulo, inicio, fin, descripcion, lugar);
    }
  }

  private abrirGoogleCalendar(titulo: string, inicio: Date, fin: Date, descripcion: string, lugar: string): void {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: titulo,
      dates: `${this.aFechaUTC(inicio)}/${this.aFechaUTC(fin)}`,
      details: descripcion,
      location: lugar,
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  }

  private descargarIcs(titulo: string, inicio: Date, fin: Date, descripcion: string, lugar: string): void {
    const escapar = (t: string) => t.replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cofradiario//Agenda Cofrade//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@cofradiario.es`,
      `DTSTAMP:${this.aFechaUTC(new Date())}`,
      `DTSTART:${this.aFechaUTC(inicio)}`,
      `DTEND:${this.aFechaUTC(fin)}`,
      `SUMMARY:${escapar(titulo)}`,
      descripcion ? `DESCRIPTION:${escapar(descripcion)}` : '',
      lugar ? `LOCATION:${escapar(lugar)}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evento-cofradiario.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
