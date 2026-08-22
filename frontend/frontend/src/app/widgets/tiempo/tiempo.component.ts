import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tiempo',
  standalone: false,
  templateUrl: './tiempo.component.html',
  styleUrls: ['./tiempo.component.css']
})
export class TiempoComponent implements OnInit, OnDestroy {
  targetDate: Date = new Date('2026-03-29T00:00:00');
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
