import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiempoDiaComponent } from './tiempo-dia.component';

describe('TiempoDiaComponent', () => {
  let component: TiempoDiaComponent;
  let fixture: ComponentFixture<TiempoDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiempoDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiempoDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
