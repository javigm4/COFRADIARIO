import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CofradiasComponent } from './cofradias.component';

describe('CofradiasComponent', () => {
  let component: CofradiasComponent;
  let fixture: ComponentFixture<CofradiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CofradiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CofradiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
