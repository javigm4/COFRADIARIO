import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { TiempoDia } from '../../widgets/interfaces/tiempo-dia.interface';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  dias: TiempoDia[] = [];
  city: string = 'Málaga';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getForecast(this.city);
  }

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
