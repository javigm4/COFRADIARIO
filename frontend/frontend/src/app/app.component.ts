import { WeatherService } from './services/weather/weather.service';
import { Component } from '@angular/core';
import { TiempoDia } from './widgets/interfaces/tiempo-dia.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';



  //esto va a ir en el app component seguramente
  dias: TiempoDia[] = [];

  city: string = 'Málaga'; // Ciudad por defecto

  constructor(private weatherService: WeatherService) {}

  
}
