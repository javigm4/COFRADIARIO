import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionCofradiaComponent } from './seleccion-cofradia.component';

describe('SeleccionCofradiaComponent', () => {
  let component: SeleccionCofradiaComponent;
  let fixture: ComponentFixture<SeleccionCofradiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeleccionCofradiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionCofradiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
