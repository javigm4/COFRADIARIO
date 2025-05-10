export interface Evento {
  id: number;
  nombre: string;
  cofradia: number,
  fecha: string;
}

export interface Cofradia {
  id: number;
  nombre: string;
  titular1: string;
  titular2: string;
  titular3: string;
  direccion: string;
  parroquia: string;
}

export interface Favorito {
  id: number;
  nombre: string;
  cofradia: number;
  fecha: string;
  id_usuario: number;
  id_evento: number;


}
