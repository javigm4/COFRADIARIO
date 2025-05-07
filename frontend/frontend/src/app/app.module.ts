import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layour/navbar/navbar.component';
import { FooterComponent } from './layour/footer/footer.component';
import { WeatherService } from './services/weather/weather.service';
import { TiempoComponent } from './widgets/tiempo/tiempo.component';
import { HttpClientModule } from '@angular/common/http';
import { TiempoDiaComponent } from './widgets/tiempo-dia/tiempo-dia.component'; // Importar HttpClientModule

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    TiempoComponent,
    TiempoDiaComponent
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
