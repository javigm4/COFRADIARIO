import { Component } from '@angular/core';
import { Evento } from '../../interfaces/agenda';
import { Input } from '@angular/core'; // Importar Input desde Angular core
import { EventosService } from '../../../services/eventos/eventos.service'; // Importar el servicio de eventos
import { Usuario } from '../../interfaces/usuario'; // Importar la interfaz de usuario
@Component({
  selector: 'app-evento',
  standalone: false,
  templateUrl: './evento.component.html',
  styleUrl: './evento.component.css'
})
export class EventoComponent {
  @Input()
  public evento !: Evento;



  cofradiaNombre: string = ''; // Almacena el nombre de la cofradía
  cofradias: any[] = []; // Lista de cofradías


  public esUsuario !: boolean; // Variable para verificar si el usuario es un usuario
  public esCofradia !: boolean; // Variable para verificar si el usuario es una cofradía
  public usuario !: Usuario;




  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe(
      (response) => {
        this.cofradias = response.cofradias; // Guardamos las cofradías
        this.cofradiaNombre = this.obtenerCofradiaNombre(this.evento.cofradia);
        this.usuario = response.usuario; // Guardamos el usuario
      },
      (error) => {
        console.error('Error al obtener las cofradías:', error);
      }
    );
  }

  obtenerCofradiaNombre(cofradiaId: number): string {
    const cofradia = this.cofradias.find(c => c.id === cofradiaId);
    return cofradia ? cofradia.nombre : 'Desconocida'; // Retorna el nombre o 'Desconocida' si no se encuentra
  }// Inicializa la propiedad eventos como un arreglo vacío


   eliminarEvento(eventoId: number): void {
    this.eventosService.eliminarEvento(eventoId).subscribe(() => {
      console.log(`Evento ${eventoId} eliminado`);
      window.location.reload(); // 🔄 Recarga la página después de eliminar
    });
  }
/*
  editarEvento(eventoId: number): void {
    this.router.navigate(['/editar', eventoId]); // Redirige a la página de edición
  }
*/


}
