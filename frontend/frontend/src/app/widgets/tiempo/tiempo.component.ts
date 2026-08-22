import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tiempo',
  standalone: false,
  templateUrl: './tiempo.component.html',
  styleUrls: ['./tiempo.component.css']
})
export class TiempoComponent implements OnInit, OnDestroy {
  targetDate: Date = TiempoComponent.getProximoDomingoDeRamos();
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  // Flags para disparar la animación
  animating = {
    days: false,
    hours: false,
    minutes: false,
    seconds: false
  };

  private timer: any;

  /** Domingo de Pascua (algoritmo de Meeus/Jones/Butcher) para el año dado */
  private static getDomingoDePascua(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = abril
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  /** Próximo Domingo de Ramos (Pascua - 7 días) a partir de hoy */
  private static getProximoDomingoDeRamos(): Date {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (const year of [hoy.getFullYear(), hoy.getFullYear() + 1]) {
      const pascua = TiempoComponent.getDomingoDePascua(year);
      const ramos = new Date(pascua);
      ramos.setDate(ramos.getDate() - 7);
      if (ramos.getTime() >= hoy.getTime()) {
        return ramos;
      }
    }
    // Fallback (no debería alcanzarse)
    return TiempoComponent.getDomingoDePascua(hoy.getFullYear() + 1);
  }

  ngOnInit(): void {
    this.calculateCountdown();
    this.timer = setInterval(() => {
      this.calculateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  calculateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return;
    }

    const newDays = Math.floor(distance / (1000 * 60 * 60 * 24));
    const newHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const newMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const newSeconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Disparar animaciones si el valor cambia
    if (newDays !== this.countdown.days) this.triggerAnim('days');
    if (newHours !== this.countdown.hours) this.triggerAnim('hours');
    if (newMinutes !== this.countdown.minutes) this.triggerAnim('minutes');
    if (newSeconds !== this.countdown.seconds) this.triggerAnim('seconds');

    this.countdown = {
      days: newDays,
      hours: newHours,
      minutes: newMinutes,
      seconds: newSeconds
    };
  }

  triggerAnim(unit: 'days' | 'hours' | 'minutes' | 'seconds'): void {
    this.animating[unit] = false;
    // Forzar reflow/re-detección de Angular usando un pequeño timeout
    setTimeout(() => {
      this.animating[unit] = true;
    }, 10);
  }
}
