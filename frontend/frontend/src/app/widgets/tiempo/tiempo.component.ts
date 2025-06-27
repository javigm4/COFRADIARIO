import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { formatDate } from '@angular/common';
import { TiempoDia } from '../interfaces/tiempo-dia.interface';

@Component({
  selector: 'app-tiempo',
  standalone: false,
  templateUrl: './tiempo.component.html',
  styleUrls: ['./tiempo.component.css']
})
export class TiempoComponent implements OnChanges {

  @Input()
  public dias: TiempoDia[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dias'] && this.dias?.length) {
      this.dias = this.dias.map(dia => ({
        ...dia,
        date: formatDate(dia.date, 'EEEE, d \'de\' MMMM', 'es-ES')
      }));
    }
  }


}
