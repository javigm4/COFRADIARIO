import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
 let service: AuthService;

  beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
  });
  service = TestBed.inject(AuthService);
  localStorage.clear();
});

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });


  it('DEBE DEVOLVER LOS DATOS DEL USUARIO', () => {
    const mockUser = { id: 1, name: 'Juan' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(service.getUsuarioData()).toEqual(mockUser);
  });


});
