import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { EditarEventoComponent } from './pages/agenda/evento/editar-evento/editar-evento.component';

const routes: Routes = [
  {path: 'inicio', component: InicioComponent}, // Cambia 'InicioComponent' por el nombre del componente que quieras usar
  {path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección al inicio al abrir la app (cuando la URL está vacía)
  {path: 'agenda', component: AgendaComponent}, // Cambia 'InicioComponent' por el nombre del componente que quieras usar
  {path: 'editar/:id', component: EditarEventoComponent },  // Nueva página de edición




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
