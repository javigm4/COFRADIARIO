import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { TiempoDia } from '../../widgets/interfaces/tiempo-dia.interface';
import { DiarioService } from '../../services/diario/diario.service';
import { EventosService } from '../../services/eventos/eventos.service';
import { CofradiasService } from '../../services/cofradias/cofradias.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  dias: TiempoDia[] = [];
  city: string = 'Málaga';
  eventosProximos: any[] = [];
  ultimosArticulos: any[] = [];
  cofradias: any[] = [];


  constructor(private weatherService: WeatherService, private diarioService: DiarioService, private eventosService: EventosService, private cofradiasService: CofradiasService) { }

  ngOnInit(): void {
    this.getForecast(this.city);
    this.getUltimosArticulos();
    this.getProximosEventos();
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

  getUltimosArticulos(): void {
    this.diarioService.getUltimosArticulos().subscribe(
      (response) => {
        this.ultimosArticulos = response.articulos ?? [];
        console.log('ULTIMOS DOS ARTICULOS :', this.ultimosArticulos);
      },
      (error) => {
        console.error('Error al obtener artículos:', error);
      }
    );
  }

 getProximosEventos(): void {
  this.eventosService.getProximosEventos().subscribe(
    (response) => {
      this.eventosProximos = response.eventos ?? [];
      this.cofradias = response.cofradias ?? [];

      const cofradiasRef = this.cofradias; // ← guardamos referencia

      this.eventosProximos.forEach(evento => {
        evento.getCofradiaNombre = () => {
        const cofradia = cofradiasRef.find(c => Number(c.id) === Number(evento.cofradia));
          return cofradia ? cofradia.nombre : 'Desconocida';
        };
        console.log('RESPUESTA EVENTOS:', response);
        console.log('RESPUESTA COFRADIAS:', response.cofradias)
      });
    },
    (error) => {
      console.error('Error al obtener artículos:', error);
    }
  );
}




}
