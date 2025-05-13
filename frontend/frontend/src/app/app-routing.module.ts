import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { EditarEventoComponent } from './pages/agenda/evento/editar-evento/editar-evento.component';
import { LoginComponent } from './pages/login/login.component'; // Importa el componente de login
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {path: 'inicio', component: InicioComponent}, // Cambia 'InicioComponent' por el nombre del componente que quieras usar
  {path: 'agenda', component: AgendaComponent}, // Cambia 'InicioComponent' por el nombre del componente que quieras usar
  {path: 'editar/:id', component: EditarEventoComponent },  // Nueva página de edición
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent },  // Ruta del login
  {path: '**', redirectTo: '/inicio' }, // Redirección a la página de inicio si la ruta no existe
  {path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección al inicio al abrir la app (cuando la URL está vacía)





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
