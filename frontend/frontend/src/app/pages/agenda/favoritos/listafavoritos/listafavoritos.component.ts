// listafavoritos.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Favorito, Evento, Cofradia } from '../../../interfaces/agenda';
import { FavoritosService } from '../../../../services/favoritos/favoritos.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-listafavoritos',
  standalone: false,
  templateUrl: './listafavoritos.component.html',
  styleUrl: './listafavoritos.component.css',
})
export class ListafavoritosComponent {
  @Input()
  public favoritos: Favorito[] = []; // Array de favoritos
  @Input()
  public eventos: Evento[] = []; // Almacena los eventos
  @Input()
  public cofradias: Cofradia[] = []; // Almacena las cofradías y sus datos

  // Agrega este Input para que se pueda enlazar desde el padre
  @Input()
  public usuario: any;

  // Puedes mantener o usar usuarioId según necesites
  public usuarioId: any;

  @Output() eliminarFavorito: EventEmitter<number> = new EventEmitter<number>(); // Evento para eliminar el favorito

  constructor(
    private favoritosService: FavoritosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.usuario) {
      // Si el usuario ya viene desde el componente padre, úsalo para asignar el usuarioId
      this.usuarioId = this.usuario.id;
    } else {
      // O si no se pasa, la puedes obtener del AuthService
      const storedUser = this.authService.getUsuarioData();
      if (storedUser) {
        this.usuarioId = storedUser.id;
      }
    }
    console.log(this.usuarioId);
  }

  onEliminar(favoritoId: number): void {
    console.log('Eliminar favorito con ID:', favoritoId);
    this.eliminarFavorito.emit(favoritoId); // Emite solo el ID del favorito
  }

  // Si deseas emplear trackBy en el template, añade esta función
  trackByFavorito(index: number, favorito: Favorito): number {
    return favorito.id;
  }
}
