import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { EditarEventoComponent } from './pages/agenda/evento/editar-evento/editar-evento.component';
import { LoginComponent } from './pages/login/login.component'; // Importa el componente de login
import { RegisterComponent } from './pages/register/register.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { EditarArticuloComponent } from './pages/diario/articulo/editar-articulo/editar-articulo.component';
import { CrearArticuloComponent } from './pages/diario/articulo/crear-articulo/crear-articulo.component';
import { SeleccionCofradiaComponent } from './pages/cofradias/seleccion-cofradia/seleccion-cofradia.component';
import { CofradiaComponent } from './pages/cofradias/cofradia/cofradia.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent }, // Cambia 'InicioComponent' por el nombre del componente que quieras usar
  { path: 'agenda', component: AgendaComponent }, // Cambia 'InicioComponent' por el nombre del componente que quieras usar
  { path: 'editar/:id', component: EditarEventoComponent }, // Nueva página de edición
  { path: 'editarArticulo/:id', component: EditarArticuloComponent }, // Nueva página de edición çde articulo
  { path: 'crear-articulo', component: CrearArticuloComponent }, // Nueva página de creación
  { path: 'seleccionCofradia', component: SeleccionCofradiaComponent },
  { path: 'cofradia/:nombre', component: CofradiaComponent },
  { path: 'contacto', component: ContactoComponent },


  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }, // Ruta del login
  { path: 'diario', component: DiarioComponent }, // Ruta del diario
  { path: '**', redirectTo: '/inicio' }, // Redirección a la página de inicio si la ruta no existe
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección al inicio al abrir la app (cuando la URL está vacía)
  { path: 'editar/:id', component: EditarEventoComponent }, // Nueva página de edición
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
