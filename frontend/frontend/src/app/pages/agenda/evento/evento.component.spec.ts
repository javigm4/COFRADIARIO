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

  

  
});
