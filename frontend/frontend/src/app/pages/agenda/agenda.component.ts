import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service'; // Importar el servicio de eventos
import { FavoritosService } from '../../services/favoritos/favoritos.service'; // Importar el modelo de Favorito
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  standalone:false
})
export class AgendaComponent implements OnInit {
  eventos: any[] = []; // Almacena los eventos
  cofradias: any[] = []; // Almacena las cofradías y sus datos
  favoritos: any[] = [];
  esUsuario: boolean = false; // Variable para verificar si el usuario es un usuario
  esCofradia: boolean = false; // Variable para verificar si el usuario es una cofradía

  constructor(private eventosService: EventosService, private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.eventosService.getEventos().subscribe(
      (response) => {        console.log('Datos de la API:', response); // 🔍 Para verificar los datos en consola

        this.eventos = response.eventos || [];
        this.cofradias = response.cofradias || [];
        this.favoritos = response.favoritos || [];
        this.esUsuario = response.esUsuario || false; // Verificar si el usuario está logueado+
        this.esCofradia = response.esCofradia || false; // Verificar si el usuario es una cofradía
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
  }

  //---------------eliminarFavorito---------------
  onEliminarFavorito(favoritoId: number): void {
    // Llamar al servicio para eliminar de la base de datos
    this.favoritosService.eliminarFavorito(favoritoId).subscribe(() => {
      // Filtrar favoritos en el frontend
      this.favoritos = this.favoritos.filter(f => f.id !== favoritoId);
    });
  }
}
