
export interface TiempoDia {
  date: string;
  temperatura: {
    min: number;
    max: number;
  }
  icono: string;
  precipitacion: number;
}
