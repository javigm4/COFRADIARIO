import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventosService } from './eventos.service';

describe('EventosService', () => {
  let service: EventosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Importa el módulo de testing HTTP
      providers: [EventosService]
    });
    service = TestBed.inject(EventosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verifica que no queden peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('DEBERIA OBTENER TODOS LOS EVENTOS', () => {
    const dummyEventos = [
      { id: 1, nombre: 'Evento 1' },
      { id: 2, nombre: 'Evento 2' }
    ];

    service.getEventos().subscribe(eventos => {
      expect(eventos.length).toBe(2);
      expect(eventos).toEqual(dummyEventos);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEventos);
  });
});
