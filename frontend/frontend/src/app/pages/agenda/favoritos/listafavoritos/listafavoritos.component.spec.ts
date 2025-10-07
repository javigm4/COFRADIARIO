import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListafavoritosComponent } from './listafavoritos.component';

describe('ListafavoritosComponent', () => {
  let component: ListafavoritosComponent;
  let fixture: ComponentFixture<ListafavoritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListafavoritosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListafavoritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
