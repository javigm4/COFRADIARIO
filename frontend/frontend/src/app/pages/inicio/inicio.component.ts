import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { EventosService } from '../../services/eventos/eventos.service';
import { DiarioService } from '../../services/diario/diario.service';
import { CofradiasService } from '../../services/cofradias/cofradias.service';

@Component({
    selector: 'app-inicio',
    standalone: false,
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
    eventosProximos: any[] = [];
    ultimosArticulos: any[] = [];
    cofradias: any[] = [];
    totalCofradias: number = 0;
    totalEventos: number = 0;
    displayTotalCofradias: number = 0;
    displayTotalEventos: number = 0;
    animationStarted: boolean = false;
    eventos: any[] = [];

    @ViewChild('estadisticas') estadisticasSection!: ElementRef;

    constructor(
        private eventosService: EventosService,
        private diarioService: DiarioService,
        private cofradiasService: CofradiasService
    ) { }

    ngOnInit(): void {
        this.cargarDatos();
    }

    ngAfterViewInit(): void {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver(): void {
        const options = {
            root: null,
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animationStarted) {
                    this.animationStarted = true;
                    this.animateCounters();
                }
            });
        }, options);

        if (this.estadisticasSection) {
            observer.observe(this.estadisticasSection.nativeElement);
        }
    }

    animateCounters(): void {
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60 fps
        const totalFrames = Math.round(duration / frameDuration);

        const animate = (currentFrame: number) => {
            const progress = currentFrame / totalFrames;

            // Smoother ease-out function
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOut(progress);

            this.displayTotalCofradias = Math.floor(easedProgress * this.totalCofradias);
            this.displayTotalEventos = Math.floor(easedProgress * this.totalEventos);

            if (currentFrame < totalFrames) {
                requestAnimationFrame(() => animate(currentFrame + 1));
            } else {
                this.displayTotalCofradias = this.totalCofradias;
                this.displayTotalEventos = this.totalEventos;
            }
        };

        requestAnimationFrame(() => animate(0));
    }

    cargarDatos(): void {

        this.eventosService.getEventos().subscribe({
            next: (respEventos) => {
                this.eventos = respEventos.eventos || [];
                this.totalEventos = this.eventos.length;
            },
            error: (err) => console.error('Error cargando eventos:', err)
        });
        // Cargar cofradías
        this.cofradiasService.getCofradias().subscribe({
            next: (respCofradias) => {
                this.totalCofradias = respCofradias.length;
                if (Array.isArray(respCofradias)) {
                    this.cofradias = respCofradias;
                } else {
                    this.cofradias = respCofradias.cofradias || [];
                }

                // Cargar eventos próximos
                this.eventosService.getProximosEventos().subscribe({
                    next: (respEventos) => {
                        const evs = respEventos.eventos || [];


                        this.eventosProximos = evs.map((e: any) => {
                            return {
                                ...e,
                                getCofradiaNombre: () => {
                                    const c = this.cofradias.find(conf => conf.id == e.cofradia);
                                    return c ? c.nombre : 'Desconocida';
                                }
                            };
                        });
                    },
                    error: (err) => console.error('Error cargando eventos:', err)
                });
            },
            error: (err) => console.error('Error cargando cofradías:', err)
        });

        // Cargar artículos
        this.diarioService.getUltimosArticulos().subscribe({
            next: (respArticulos) => {
                this.ultimosArticulos = respArticulos.articulos || [];
            },
            error: (err) => console.error('Error cargando artículos:', err)
        });
    }
}
