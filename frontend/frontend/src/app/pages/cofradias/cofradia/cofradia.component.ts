import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CofradiasService } from '../../../services/cofradias/cofradias.service';

@Component({
  selector: 'app-cofradia',
  standalone: false,
  templateUrl: './cofradia.component.html',
  styleUrl: './cofradia.component.css'
})
export class CofradiaComponent {
cofradia: any;

  constructor(
    private route: ActivatedRoute,
    private cofradiasService: CofradiasService
  ) {}

  ngOnInit(): void {
    const nombreCofradia = this.route.snapshot.paramMap.get('nombre');
    if (nombreCofradia) {
      this.obtenerCofradia(nombreCofradia);
      }
  }

  obtenerCofradia(nombre: string): void {
    this.cofradiasService.obtenerCofradia(nombre).subscribe(
      (data) => {
        this.cofradia = data;
              console.log('Datos recibidos:', this.cofradia); // Verifica si `cofradia` tiene datos
      },
      (error) => {
        console.error('Error al obtener información de la cofradía:', error);
      }
    );
  }
}


