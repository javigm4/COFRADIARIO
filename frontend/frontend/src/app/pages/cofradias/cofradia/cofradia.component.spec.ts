import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CofradiaComponent } from './cofradia.component';

describe('CofradiaComponent', () => {
  let component: CofradiaComponent;
  let fixture: ComponentFixture<CofradiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CofradiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CofradiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
