import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiarioService } from '../../services/diario/diario.service'; // Importa el servicio
@Component({
  selector: 'app-diario',
  standalone: false,
  templateUrl: './diario.component.html',
  styleUrl: './diario.component.css',
})
export class DiarioComponent {
  articulos: any[] = []; //array de los articulos
  usuarios: any[] = []; // Agregamos la lista de usuarios
  constructor(private http: HttpClient, private diarioService: DiarioService) {}

  ngOnInit(): void {
    this.getArticulos();
  }

  getArticulos(): void {
    this.diarioService.getArticulos().subscribe(
      (response) => {
        this.articulos = response.articulos ?? [];
        this.usuarios = response.usuarios ?? []; // Guardamos los usuarios
        console.log('Artículos cargados:', this.articulos);
      },
      (error) => {
        console.error('Error al obtener artículos:', error);
      }
    );
  }
}
