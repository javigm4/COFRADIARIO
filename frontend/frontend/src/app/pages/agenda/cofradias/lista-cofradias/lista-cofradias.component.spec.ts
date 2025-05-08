import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCofradiasComponent } from './lista-cofradias.component';

describe('ListaCofradiasComponent', () => {
  let component: ListaCofradiasComponent;
  let fixture: ComponentFixture<ListaCofradiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaCofradiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCofradiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
