import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoComponent } from './evento.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth/auth.service';
import { FavoritosService } from '../../../services/favoritos/favoritos.service';
import { EventosService } from '../../../services/eventos/eventos.service';

describe('EventoComponent', () => {
  let component: EventoComponent;
  let fixture: ComponentFixture<EventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventoComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: { getUsuarioData: () => ({ role: '', name: '' }) } },
        { provide: FavoritosService, useValue: {} },
        { provide: EventosService, useValue: { eliminarEvento: () => ({ subscribe: () => {} }) } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar el nombre de la cofradía según el evento y la lista de cofradías', () => {
    component.cofradias = [
      { id: 1, nombre: 'Pollinica' },
      { id: 2, nombre: 'Dulce Nombre' }
    ];
    component.evento = {
      id: 10,
      nombre: 'Misa de la Virgen',
      cofradia: 2,
      fecha: '2025-05-29',
    };
    component.calculaCofradiaNombre();
    expect(component.cofradiaNombre).toBe('Dulce Nombre');
  });

  it('debería asignar "Desconocida" si no encuentra la cofradía', () => {
    component.cofradias = [{ id: 1, nombre: 'Pollinica' }];
    component.evento = {
      id: 10,
      nombre: 'Evento no encontrado',
      cofradia: 3,
      fecha: '2025-05-29',
    };
    component.calculaCofradiaNombre();
    expect(component.cofradiaNombre).toBe('Desconocida');
  });
});
