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
  public favoritos: Favorito[] = [];
  @Input()
  public eventos: Evento[] = [];
  @Input()
  public cofradias: Cofradia[] = [];

   @Input()
  public usuario: any;

   public usuarioId: any;

  @Output() eliminarFavorito: EventEmitter<number> = new EventEmitter<number>();
  constructor(
    private favoritosService: FavoritosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.usuario) {
      this.usuarioId = this.usuario.id;
    } else {
      const storedUser = this.authService.getUsuarioData();
      if (storedUser) {
        this.usuarioId = storedUser.id;
      }
    }
    console.log(this.usuarioId);
  }

  onEliminar(favoritoId: number): void {
    console.log('Eliminar favorito con ID:', favoritoId);
    this.eliminarFavorito.emit(favoritoId);
  }


}
