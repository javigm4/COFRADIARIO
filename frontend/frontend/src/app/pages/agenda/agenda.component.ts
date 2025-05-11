import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service'; // Importar el servicio de eventos
import { FavoritosService } from '../../services/favoritos/favoritos.service'; // Importar el modelo de Favorito
import { Usuario } from '../interfaces/usuario'; // Importar el modelo de Usuario
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone: false,
})
export class AgendaComponent implements OnInit {
  eventos: any[] = []; // Almacena los eventos
  cofradias: any[] = []; // Almacena las cofradías y sus datos
  favoritos: any[] = [];
  esUsuario: boolean = false; // Variable para verificar si el usuario es un usuario
  esCofradia: boolean = false; // Variable para verificar si el usuario es una cofradía

  cofradiaId: number = 0; //almacena el id de la cofradia

  //usuario : any = {}; //almacena el usuario logueado (que viene en el response de eventos)
  usuario: any = {}

  constructor(
    private eventosService: EventosService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.eventosService.getEventos().subscribe(
  (response) => {
    console.log('Respuesta completa de API:', response); // ✅ Verificar qué llega exactamente

    this.eventos = response.eventos ?? [];
    this.cofradias = response.cofradias ?? [];
    this.favoritos = response.favoritos ?? [];
    this.esUsuario = response.esUsuario ?? false;
    this.esCofradia = response.esCofradia ?? false;
    this.usuario = response.usuario;
    this.usuario = { ...this.usuario }; // ✅ Esto fuerza la actualización en Angular



    console.log('Usuario en AgendaComponent después de asignar:', this.usuario); // ✅ Verificar la asignación
  },
  (error) => {
    console.error('Error al obtener eventos:', error);
  }
);

  }

  //--------------- eliminarFavorito ---------------
  onEliminarFavorito(favoritoId: number): void {
    // Llamar al servicio para eliminar de la base de datos
    this.favoritosService.eliminarFavorito(favoritoId).subscribe(() => {
      // Filtrar favoritos en el frontend
      this.favoritos = this.favoritos.filter((f) => f.id !== favoritoId);
    });
  }

  //--------------- crear evento ---------------
  crearEvento(): void {
    this.cofradiaId =
      this.cofradias.find((c) => c.nombre === this.usuario.name)?.id || 0;

    // Obtén los valores directamente del formulario
    const fechaInput = (document.getElementById('fecha') as HTMLInputElement)
      .value;
    const horaInput = (document.getElementById('hora') as HTMLInputElement)
      .value;

    const eventoData = {
      nombre: (document.getElementById('nombre') as HTMLInputElement).value,
      fecha: fechaInput, // Enviar fecha sin hora
      hora: horaInput, // Enviar hora por separado
      cofradia: this.cofradiaId,
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
