import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CofradiasService } from '../../../services/cofradias/cofradias.service';

@Component({
  selector: 'app-cofradia',
  standalone: false,
  templateUrl: './cofradia.component.html',
  styleUrl: './cofradia.component.css',
})
export class CofradiaComponent {
  cofradia: any;
  titulares: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cofradiasService: CofradiasService
  ) {}

  ngOnInit(): void {
    const nombreCofradiaUrl = this.route.snapshot.paramMap.get('nombre') || '';
    const nombreCofradia = nombreCofradiaUrl.replace(/-/g, ' ');
    this.obtenerCofradia(nombreCofradia);
  }

  obtenerCofradia(nombre: string): void {
    this.cofradiasService.obtenerCofradia(nombre).subscribe(
      (data) => {
        this.cofradia = data;
        console.log('Datos recibidos:', this.cofradia); // Verifica si `cofradia` tiene datos
        this.titulares = this.cofradia.titulares || [];
        console.log('Titulares:', this.titulares); // Verifica si `titulares` tiene datos
      },
      (error) => {
        console.error('Error al obtener información de la cofradía:', error);
      }
    );
  }

  // En tu componente .ts
  get textoConSaltos() {
    return (this.cofradia?.texto || '').replace(/\n/g, '<br>');
  }

  getRutaCristo(): string {
  if (!this.cofradia?.cofradia?.nombre) return '';
  return 'public/cofradiasDatos/' + this.cofradia.cofradia.nombre.toUpperCase().replace(/ /g, '-') + '/cristo.jpg';
}
  getRutaVirgen(): string {
    if (!this.cofradia?.cofradia?.nombre) return '';
    return 'public/cofradiasDatos/' + this.cofradia.cofradia.nombre.toUpperCase().replace(/ /g, '-') + '/virgen.jpg';
  }
}
