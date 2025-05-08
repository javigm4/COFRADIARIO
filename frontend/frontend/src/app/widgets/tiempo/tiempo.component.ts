import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service'; // Importar el servicio de clima
import { TiempoDia } from '../interfaces/tiempo-dia.interface';
import { Input } from '@angular/core'; // Importar Input para recibir datos desde el padre
@Component({
  selector: 'app-tiempo',
  standalone: false,
  templateUrl: './tiempo.component.html',
  styleUrl: './tiempo.component.css'
})
export class TiempoComponent {

  @Input()
  public dias: TiempoDia[] = [];


}
