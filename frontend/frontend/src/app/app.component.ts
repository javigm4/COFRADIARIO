import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TiempoDia } from './widgets/interfaces/tiempo-dia.interface';
import { VisitasService } from './services/visitas/visitas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private router: Router, private visitasService: VisitasService) {
    this.router.events
      .pipe(filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd))
      .subscribe((evento) => {
        this.visitasService.registrar(evento.urlAfterRedirects).subscribe({ error: () => { } });
      });
  }
}
