import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventoComponent } from './evento.component';

describe('EventoComponent', () => {
  let component: EventoComponent;
  let fixture: ComponentFixture<EventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventoComponent],
      imports: [HttpClientTestingModule], // <-- Aquí lo añades
    }).compileComponents();

    fixture = TestBed.createComponent(EventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería asignar el nombre de la cofradía según el evento y la lista de cofradías', () => {
    component.cofradias = [
      { id: 1, nombre: 'Cofradía A' },
      { id: 2, nombre: 'Cofradía B' },
    ];

    component.evento = {
      id: 10,
      nombre: 'Evento X',
      cofradia: 2,
      fecha: '2025-05-29',
    };

    component.calculaCofradiaNombre();

    expect(component.cofradiaNombre).toBe('Cofradía B');
  });

  it('debería asignar "Desconocida" si no encuentra la cofradía', () => {
    component.cofradias = [{ id: 1, nombre: 'Cofradía A' }];

    component.evento = {
      id: 10,
      nombre: 'Evento X',
      cofradia: 3,
      fecha: '2025-05-29',
    };

    component.calculaCofradiaNombre();

    expect(component.cofradiaNombre).toBe('Desconocida');
  });
});
