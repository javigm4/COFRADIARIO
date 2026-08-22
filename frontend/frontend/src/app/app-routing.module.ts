import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { EditarEventoComponent } from './pages/agenda/evento/editar-evento/editar-evento.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { EditarArticuloComponent } from './pages/diario/articulo/editar-articulo/editar-articulo.component';
import { CrearArticuloComponent } from './pages/diario/articulo/crear-articulo/crear-articulo.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { VerificadoComponent } from './verificado/verificado.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';
import { PoliticaPrivacidadComponent } from './pages/politica-privacidad/politica-privacidad.component';
import { AvisoLegalComponent } from './pages/aviso-legal/aviso-legal.component';
import { TerminosUsoComponent } from './pages/terminos-uso/terminos-uso.component';

const routes: Routes = [
    { path: 'inicio', component: InicioComponent },
    { path: 'agenda', component: AgendaComponent },
    { path: 'calendario', component: CalendarioComponent },
    { path: 'aviso-legal', component: AvisoLegalComponent },
    { path: 'terminos-uso', component: TerminosUsoComponent },
    { path: 'politica-privacidad', component: PoliticaPrivacidadComponent },
    { path: 'editar/:id', component: EditarEventoComponent },
    { path: 'editarArticulo/:id', component: EditarArticuloComponent },
    { path: 'crear-articulo', component: CrearArticuloComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'verificado', component: VerificadoComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'diario', component: DiarioComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: '**', redirectTo: '/inicio' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
