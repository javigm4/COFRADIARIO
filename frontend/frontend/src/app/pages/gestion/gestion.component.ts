import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { EventosService } from '../../services/eventos/eventos.service';
import { NotificacionService } from '../../services/notificacion/notificacion.service';
import { UbicacionesService } from '../../services/ubicaciones/ubicaciones.service';
import { Router } from '@angular/router';

type Seccion = 'estadisticas' | 'cofradias' | 'usuarios' | 'eventos';

@Component({
  selector: 'app-gestion',
  standalone: false,
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.css'
})
export class GestionComponent implements OnInit {
  seccionActiva: Seccion = 'estadisticas';
  sidebarAbierto = false;

  estadisticas: any = null;

  cofradias: any[] = [];
  usuarios: any[] = [];
  eventos: any[] = [];

  busquedaCofradias = '';
  busquedaUsuarios = '';
  busquedaEventos = '';

  modalCofradia = false;
  cofradiaEditando: any = null;
  formCofradia: any = {};
  guardandoCofradia = false;

  modalVincular = false;
  cofradiaVinculando: any = null;
  usuariosSinCofradia: any[] = [];
  idUserSeleccionado: number | null = null;

  provincias: string[] = [];
  municipios: string[] = [];

  constructor(
    private adminService: AdminService,
    private eventosService: EventosService,
    private notificacionService: NotificacionService,
    private ubicacionesService: UbicacionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarTodo();
    this.ubicacionesService.obtenerProvincias().subscribe(provincias => {
      this.provincias = provincias;
    });
  }

  onProvinciaFormChange(): void {
    this.formCofradia.localidad = '';
    this.municipios = [];
    if (!this.formCofradia.provincia) return;
    this.ubicacionesService.obtenerMunicipios(this.formCofradia.provincia).subscribe(municipios => {
      this.municipios = municipios;
    });
  }

  cargarTodo(): void {
    this.adminService.estadisticas().subscribe({ next: r => this.estadisticas = r });
    this.cargarCofradias();
    this.cargarUsuarios();
    this.cargarEventos();
  }

  cargarCofradias(): void {
    this.adminService.listarCofradias().subscribe({ next: r => this.cofradias = r || [] });
  }

  cargarUsuarios(): void {
    this.adminService.listarUsuarios().subscribe({ next: r => this.usuarios = r.usuarios || [] });
  }

  cargarEventos(): void {
    this.eventosService.getEventos().subscribe({
      next: r => {
        const cofradiasMap: { [id: number]: string } = {};
        (r.cofradias || []).forEach((c: any) => cofradiasMap[c.id] = c.nombre);
        this.eventos = (r.eventos || []).map((e: any) => ({
          ...e,
          cofradiaNombre: cofradiasMap[e.cofradia] || 'Sin cofradía',
        }));
      }
    });
  }

  navegarA(seccion: Seccion): void {
    this.seccionActiva = seccion;
    this.sidebarAbierto = false;
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }

  get cofradiasFiltradas(): any[] {
    const t = this.busquedaCofradias.trim().toLowerCase();
    if (!t) return this.cofradias;
    return this.cofradias.filter(c =>
      (c.nombre || '').toLowerCase().includes(t) ||
      (c.localidad || '').toLowerCase().includes(t) ||
      (c.provincia || '').toLowerCase().includes(t)
    );
  }

  get usuariosFiltrados(): any[] {
    const t = this.busquedaUsuarios.trim().toLowerCase();
    if (!t) return this.usuarios;
    return this.usuarios.filter(u =>
      (u.name || '').toLowerCase().includes(t) || (u.email || '').toLowerCase().includes(t)
    );
  }

  get eventosFiltrados(): any[] {
    const t = this.busquedaEventos.trim().toLowerCase();
    if (!t) return this.eventos;
    return this.eventos.filter(e =>
      (e.nombre || '').toLowerCase().includes(t) ||
      (e.cofradiaNombre || '').toLowerCase().includes(t) ||
      (e.lugar || '').toLowerCase().includes(t)
    );
  }

  // ----- COFRADÍAS -----
  abrirModalCrearCofradia(): void {
    this.cofradiaEditando = null;
    this.formCofradia = { titulares: [{ nombre: '', foto_url: '' }] };
    this.municipios = [];
    this.modalCofradia = true;
  }

  abrirModalEditarCofradia(c: any): void {
    this.cofradiaEditando = c;
    this.formCofradia = { ...c };
    this.formCofradia.titulares = this.normalizarTitularesForm(this.formCofradia.titulares);
    this.municipios = [];
    if (this.formCofradia.provincia) {
      this.ubicacionesService.obtenerMunicipios(this.formCofradia.provincia).subscribe(municipios => {
        this.municipios = municipios;
      });
    }
    this.modalCofradia = true;
  }

  cerrarModalCofradia(): void {
    this.modalCofradia = false;
  }

  agregarTitularForm(): void {
    this.formCofradia.titulares.push({ nombre: '', foto_url: '' });
  }

  quitarTitularForm(index: number): void {
    this.formCofradia.titulares.splice(index, 1);
    if (this.formCofradia.titulares.length === 0) {
      this.formCofradia.titulares.push({ nombre: '', foto_url: '' });
    }
  }

  private normalizarTitularesForm(titulares: any[]): { nombre: string; foto_url: string }[] {
    const lista = (titulares || []).map((t: any) =>
      typeof t === 'string'
        ? { nombre: t, foto_url: '' }
        : { nombre: t?.nombre || '', foto_url: t?.foto_url || '' }
    );
    return lista.length > 0 ? lista : [{ nombre: '', foto_url: '' }];
  }

  guardarCofradia(): void {
    if (!this.formCofradia.nombre) {
      this.notificacionService.error('El nombre de la cofradía es obligatorio.');
      return;
    }

    this.formCofradia.titulares = (this.formCofradia.titulares || [])
      .map((t: any) => ({ nombre: (t.nombre || '').trim(), foto_url: (t.foto_url || '').trim() }))
      .filter((t: any) => t.nombre.length > 0);

    this.guardandoCofradia = true;
    const obs = this.cofradiaEditando
      ? this.adminService.editarCofradia(this.cofradiaEditando.id, this.formCofradia)
      : this.adminService.crearCofradia(this.formCofradia);

    obs.subscribe({
      next: () => {
        this.guardandoCofradia = false;
        this.notificacionService.exito(this.cofradiaEditando ? 'Cofradía actualizada.' : 'Cofradía creada.');
        this.cerrarModalCofradia();
        this.cargarCofradias();
      },
      error: (err) => {
        this.guardandoCofradia = false;
        this.notificacionService.error(err.error?.message || 'No se pudo guardar la cofradía.');
      }
    });
  }

  eliminarCofradia(c: any): void {
    if (!confirm(`¿Eliminar la cofradía "${c.nombre}"?`)) return;
    this.adminService.eliminarCofradia(c.id).subscribe({
      next: () => {
        this.notificacionService.exito('Cofradía eliminada.');
        this.cargarCofradias();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo eliminar.')
    });
  }

  abrirModalVincular(c: any): void {
    this.cofradiaVinculando = c;
    this.idUserSeleccionado = null;
    this.adminService.usuariosSinCofradia().subscribe({ next: r => this.usuariosSinCofradia = r || [] });
    this.modalVincular = true;
  }

  cerrarModalVincular(): void {
    this.modalVincular = false;
  }

  confirmarVincular(): void {
    if (!this.idUserSeleccionado || !this.cofradiaVinculando) return;
    this.adminService.vincularUsuario(this.cofradiaVinculando.id, this.idUserSeleccionado).subscribe({
      next: () => {
        this.notificacionService.exito('Usuario vinculado.');
        this.cerrarModalVincular();
        this.cargarCofradias();
        this.cargarUsuarios();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo vincular.')
    });
  }

  desvincularUsuario(c: any): void {
    if (!confirm(`¿Desvincular el usuario de "${c.nombre}"?`)) return;
    this.adminService.desvincularUsuario(c.id).subscribe({
      next: () => {
        this.notificacionService.exito('Usuario desvinculado.');
        this.cargarCofradias();
        this.cargarUsuarios();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo desvincular.')
    });
  }

  // ----- USUARIOS -----
  verificarUsuario(u: any): void {
    this.adminService.verificarUsuario(u.id).subscribe({
      next: () => {
        this.notificacionService.exito('Usuario verificado.');
        this.cargarUsuarios();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo verificar.')
    });
  }

  toggleCofradia(u: any): void {
    const accion = u.role === 'cofradia' ? 'quitarle el rol de cofradía a' : 'convertir en cofradía a';
    if (!confirm(`¿Seguro que quieres ${accion} "${u.name}"?`)) return;
    this.adminService.toggleCofradia(u.id).subscribe({
      next: () => {
        this.notificacionService.exito('Rol actualizado.');
        this.cargarUsuarios();
        this.cargarCofradias();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo actualizar el rol.')
    });
  }

  toggleAdmin(u: any): void {
    const accion = u.is_admin ? 'quitar' : 'dar';
    if (!confirm(`¿Seguro que quieres ${accion} permisos de administrador a "${u.name}"?`)) return;
    this.adminService.toggleAdmin(u.id).subscribe({
      next: () => {
        this.notificacionService.exito('Permisos actualizados.');
        this.cargarUsuarios();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo actualizar.')
    });
  }

  eliminarUsuario(u: any): void {
    if (!confirm(`¿Eliminar la cuenta de "${u.name}"? Esta acción no se puede deshacer.`)) return;
    this.adminService.eliminarUsuario(u.id).subscribe({
      next: () => {
        this.notificacionService.exito('Usuario eliminado.');
        this.cargarUsuarios();
        this.cargarCofradias();
      },
      error: (err) => this.notificacionService.error(err.error?.message || 'No se pudo eliminar.')
    });
  }

  // ----- EVENTOS -----
  editarEventoEnAgenda(e: any): void {
    this.router.navigate(['/agenda'], { queryParams: { evento: e.id } });
  }
}
