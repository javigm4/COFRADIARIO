import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layour/navbar/navbar.component';
import { TiempoComponent } from './widgets/tiempo/tiempo.component';
import { HttpClientModule } from '@angular/common/http';
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
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { EditarArticuloComponent } from './pages/diario/articulo/editar-articulo/editar-articulo.component';
import { CrearArticuloComponent } from './pages/diario/articulo/crear-articulo/crear-articulo.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { VerificadoComponent } from './verificado/verificado.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CookieBannerComponent } from './widgets/cookie-banner/cookie-banner.component';
import { FooterComponent } from './layour/footer/footer.component';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';
import { AvisoLegalComponent } from './pages/aviso-legal/aviso-legal.component';
import { TerminosUsoComponent } from './pages/terminos-uso/terminos-uso.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TiempoComponent,
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
    ContactoComponent,
    VerificadoComponent,
    ResetPasswordComponent,
    CalendarioComponent,
    PoliticaPrivacidadComponent,
    AvisoLegalComponent,
    TerminosUsoComponent,
    FooterComponent,
    CookieBannerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    FullCalendarModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
