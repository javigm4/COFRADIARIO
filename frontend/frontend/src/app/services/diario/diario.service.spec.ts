import { TestBed } from '@angular/core/testing';

import { DiarioService } from './diario.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('DiarioService', () => {
  let service: DiarioService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

    });
    service = TestBed.inject(DiarioService);
        httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('DEBERIA OBTENER TODOS LOS ARTICULOS', () => {
    const dummyArticulos = [
      { id: 1, titulo: 'Articulo 1' },
      { id: 2, titulo: 'Articulo 2' }
    ];

       service.getArticulos().subscribe(articulos => {
      expect(articulos.length).toBe(2);
      expect(articulos).toEqual(dummyArticulos);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyArticulos);
  });


    it('DEBERÍA CREAR UN ARTÍCULO', () => {
    const nuevoArticulo = {
      titular: 'Nuevo artículo',
      cuerpo: 'Contenido del artículo',
      id_autor: 1
    };

    const respuestaEsperada = { ...nuevoArticulo, id: 123 };

    service.crearArticulo(nuevoArticulo).subscribe(respuesta => {
      expect(respuesta).toEqual(respuestaEsperada);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoArticulo);
    req.flush(respuestaEsperada);
  });

  it('DEBERIA BORRAR UN ARTICULO', () => {
    const articuloId = 1;
    service.eliminarArticulo(articuloId).subscribe(respuesta => {
      expect(respuesta).toBeNull();
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/${articuloId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
