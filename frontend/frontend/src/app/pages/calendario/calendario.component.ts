import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventosService } from '../../services/eventos/eventos.service';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  calendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    editable: false,
    selectable: false,
    events: [],

    // Contenido de cada celda del calendario
    dayCellContent: function (arg: any) {
      const date = arg.date;
      if (window.innerWidth <= 768) {
        const options = { weekday: 'short' };
        const dayStr = date.toLocaleDateString('es-ES', options); // "Lun", "Mar", etc.
        const dayNum = arg.dayNumberText; // número del día
        return {
          html: `<div style="
      font-weight: bold;
      font-size: 1rem;
      text-align: center;
      color: #ff4500;
      background: linear-gradient(135deg, #fff8dc, #ffe4b5);
      padding: 6px 0;
      border-radius: 8px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.15);
      text-decoration: none;
      font-family: 'Arial', sans-serif;
    ">${dayStr} ${dayNum}</div>` // ← CONCATENAR nombre y número
        };


      } else {
        // Para escritorio, solo número del día
        return {
          html: `<div style="
            font-weight: bold;
            font-size: 1rem;
            text-align: center;
            color: #333;
            font-family: 'Arial', sans-serif;
          ">${arg.dayNumberText}</div>`
        };
      }
    },

    // Contenido de los eventos
    eventContent: function (arg: any) {
      return {
        html: `<div>${arg.event.title}</div>
               <small style="color:#666;">${arg.event.extendedProps.cofradia}</small>`
      };
    },

    // Click en eventos
    eventClick: function (arg: any) {
      const titulo = arg.event.title;
      const lugar = arg.event.extendedProps.lugar;
      const detalles = arg.event.extendedProps.detalles;
      const hora = arg.event.extendedProps.hora;

      const overlay = document.getElementById('overlay') as HTMLElement;
      const div = document.getElementById('detalleEvento') as HTMLElement;
      const tituloEl = document.getElementById('detalleTitulo') as HTMLElement;
      const lugarEl = document.getElementById('detalleLugar') as HTMLElement;
      const horaEl = document.getElementById('detalleHora') as HTMLElement;
      const detallesEl = document.getElementById('detalleDescripcion') as HTMLElement;
      const cerrarBtn = document.getElementById('cerrarDetalle') as HTMLElement;

      if (div && tituloEl && lugarEl && horaEl && detallesEl && overlay && cerrarBtn) {
        tituloEl.textContent = titulo;
        lugarEl.innerHTML = `<strong>Lugar:</strong> ${lugar}`;
        horaEl.innerHTML = `<strong>Hora:</strong> ${hora}`;
        detallesEl.innerHTML = `<strong>Detalles:</strong> ${detalles}`;

        overlay.classList.add('show');
        div.classList.add('show');

        const cerrar = () => {
          overlay.classList.remove('show');
          overlay.classList.add('hide');

          div.classList.remove('show');
          div.classList.add('hide');

          setTimeout(() => {
            overlay.classList.remove('hide');
            div.classList.remove('hide');
          }, 300);
        };

        cerrarBtn.onclick = cerrar;
        overlay.onclick = cerrar;
      }
    },

    // Scroll interno solo en móviles con muchos eventos
    datesSet: function () {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          const dayCells = document.querySelectorAll('.fc-daygrid-day');
          dayCells.forEach(cell => {
            const container = cell.querySelector('.fc-daygrid-day-events') as HTMLElement;
            if (!container) return;
          });
        }, 0);
      }
    }
  };

  constructor(private eventosService: EventosService) { }

  ngOnInit() {
    this.eventosService.getEventos().subscribe(res => {
      const cofradiasMap: any = {};
      res.cofradias.forEach((c: any) => {
        cofradiasMap[c.id] = c.nombre;
      });

      this.calendarOptions.events = res.eventos.map((e: any) => ({
        title: e.nombre,
        start: e.fecha.replace(" ", "T"), // formato ISO
        extendedProps: {
          id: e.id,
          lugar: e.lugar,
          detalles: e.detalles,
          cofradia: cofradiasMap[e.cofradia] || 'Sin cofradía',
          hora: e.fecha.split(" ")[1].slice(0, 5) // extrae HH:MM
        }
      }));
    });
  }
}
