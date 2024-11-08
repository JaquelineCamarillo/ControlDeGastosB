import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  usuario: any = null;
  errorMessage: string | null = null;
  userData: any=null;

  constructor(private UsuarioService: UsuarioService,private userService:UserService) {}

  ngOnInit(): void{

    this.userData= this.userService.getUserData();
    const idUsuario = localStorage.getItem('IdUsuario');

    if (idUsuario) {
      this.UsuarioService.getUsuarioPorId(idUsuario).subscribe(
        (usuario) => {
          this.usuario = usuario;
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.errorMessage = 'Ocurrió un error al cargar los detalles del usuario.';
        }
      );
    } else {
      this.errorMessage = 'No se ha encontrado el ID de usuario. Por favor, inicie sesión nuevamente.';
    }
  }
}