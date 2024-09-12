// login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string | null = null;
  notificationMessage: string | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router,
    private notificationService: NotificationService,) {}


    ngOnInit() {
      this.notificationService.notification$.subscribe(message => {
        this.notificationMessage = message;
      });
    }

    
  onSubmit(loginForm: any) {
    if (loginForm.invalid) {
      this.errorMessage = 'Los campos no pueden estar vacíos';
      return;

      
    }

    const { username, password } = loginForm.value;

    this.usuarioService.getUsuarios().subscribe(
      (usuarios: any[]) => {
        const usuario = usuarios.find(u => u.Usuario === username && u.Contrasena === password);

        if (usuario) {
          localStorage.setItem('IdUsuario', usuario.IdUsuario);
          this.router.navigate(['/inicio-usuario']);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Ocurrió un error al verificar el usuario. Intente nuevamente más tarde.';
      }
    );
    
  }
  
}