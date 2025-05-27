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
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FavoritoComponent } from './pages/agenda/favoritos/favorito/favorito.component';
import { ListafavoritosComponent } from './pages/agenda/favoritos/listafavoritos/listafavoritos.component';
import { EditarEventoComponent } from './pages/agenda/evento/editar-evento/editar-evento.component';
import { FormsModule } from '@angular/forms'; // ✅ IMPORTA FormsModule AQUÍ
import { CookieService } from 'ngx-cookie-service';
import { EditarArticuloComponent } from './pages/diario/articulo/editar-articulo/editar-articulo.component';
import { CrearArticuloComponent } from './pages/diario/articulo/crear-articulo/crear-articulo.component';
import { CofradiasComponent } from './pages/cofradias/cofradias.component';
import { CofradiaComponent } from './pages/cofradias/cofradia/cofradia.component';
import { SeleccionCofradiaComponent } from './pages/cofradias/seleccion-cofradia/seleccion-cofradia.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

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
    InicioComponent,
    LoginComponent,
    RegisterComponent,
    FavoritoComponent,
    ListafavoritosComponent,
    EditarEventoComponent,
    EditarArticuloComponent,
    CrearArticuloComponent,
    CofradiasComponent,
    CofradiaComponent,
    SeleccionCofradiaComponent,
    ContactoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Importar HttpClientModule para realizar peticiones HTTP
    FormsModule,  // ✅ AGREGA FormsModule AQUÍ
  ],
  providers: [WeatherService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
