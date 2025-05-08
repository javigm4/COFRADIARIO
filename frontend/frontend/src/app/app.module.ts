import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layour/navbar/navbar.component';
import { WeatherService } from './services/weather/weather.service';
import { TiempoComponent } from './widgets/tiempo/tiempo.component';
import { HttpClientModule } from '@angular/common/http';
import { TiempoDiaComponent } from './widgets/tiempo-dia/tiempo-dia.component';
import { EventoComponent } from './pages/agenda/evento/evento.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { ListaEventosComponent } from './pages/agenda/lista-eventos/lista-eventos.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { ListaArticulosComponent } from './pages/diario/lista-articulos/lista-articulos.component';
import { ArticuloComponent } from './pages/diario/articulo/articulo.component';
import { InicioComponent } from './pages/inicio/inicio.component'; // Importar HttpClientModule

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TiempoComponent,
    TiempoDiaComponent,
    EventoComponent,
    AgendaComponent,
    ListaEventosComponent,
    DiarioComponent,
    ListaArticulosComponent,
    ArticuloComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule // Importar HttpClientModule para realizar peticiones HTTP
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
