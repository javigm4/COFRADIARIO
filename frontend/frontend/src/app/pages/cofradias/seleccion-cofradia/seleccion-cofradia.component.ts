import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CofradiasService } from '.././../../services/cofradias/cofradias.service';
@Component({
  selector: 'app-seleccion-cofradia',
  standalone: false,
  templateUrl: './seleccion-cofradia.component.html',
  styleUrl: './seleccion-cofradia.component.css',
})
export class SeleccionCofradiaComponent {
  cofradias: any[] = [];

  constructor(private cofradiasService: CofradiasService) {}

  ngOnInit(): void {
    this.obtenerCofradias();
  }

  obtenerCofradias(): void {
    this.cofradiasService.getCofradias().subscribe(
      (data) => {
        this.cofradias = data;
      },
      (error) => {
        console.error('Error al obtener cofradías:', error);
      }
    );
  }

  formatCofradiaName(nombre: string): string {
    return nombre.replace(/\s/g, '-');
  }

}
