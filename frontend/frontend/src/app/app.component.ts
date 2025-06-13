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

  ngOnInit(): void {
    this.getForecast('Málaga');  // Obtener pronóstico para Málaga
  }

  // Método para obtener el pronóstico y manejar los datos
  getForecast(city: string): void {
    this.weatherService.getForecast(city).subscribe(
      (data) => {
         this.dias = data.forecast.forecastday.map((dia: any) => ({
          date: dia.date,
          temperatura: dia.day.avgtemp_c,
          icono: 'https:' + dia.day.condition.icon,
          precipitacion: dia.day.daily_chance_of_rain + '%'
        }));
      },
      (error) => {
        console.error('Error al obtener el pronóstico', error);
      }
    );
  }
}
