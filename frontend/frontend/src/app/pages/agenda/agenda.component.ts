import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service';
import { FavoritosService } from '../../services/favoritos/favoritos.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone: false,
})
export class AgendaComponent implements OnInit {
  eventos: any[] = [];
  cofradias: any[] = [];
  favoritos: any[] = [];
  esUsuario: boolean = false;
  esCofradia: boolean = false;
  usuario : any ;


  constructor(
    private eventosService: EventosService, private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioData(); // 📌 Obtener el usuario desde `localStorage`

    if (usuario) {
      this.esUsuario = usuario.rol === 'usuario';
      this.esCofradia = usuario.rol === 'cofradia';
    }
    console.log(usuario);
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.eventosService.getEventos().subscribe(
      (response) => {
        this.eventos = response.eventos ?? [];
        this.cofradias = response.cofradias ?? [];
        this.favoritos = response.favoritos ?? [];
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

 // ----- C R E A R   E V E N T O -----
  crearEvento(): void {
    if (!this.esCofradia) {
      console.error('Solo una cofradía puede crear eventos.');
      return;
    }

    const cofradiaId = this.cofradias.find((c) => c.nombre === this.usuario.nombre)?.id || 0;
    const fechaInput = (document.getElementById('fecha') as HTMLInputElement).value;
    const horaInput = (document.getElementById('hora') as HTMLInputElement).value;

    const eventoData = {
      nombre: (document.getElementById('nombre') as HTMLInputElement).value,
      fecha: fechaInput,
      hora: horaInput,
      cofradia: cofradiaId,
    };

    this.eventosService.crearEvento(eventoData).subscribe(
      (response) => {
        console.log('Evento creado:', response);
        alert('Evento creado con éxito');
      },
      (error) => {
        console.error('Error al crear el evento:', error);
      }
    );
  }
}
