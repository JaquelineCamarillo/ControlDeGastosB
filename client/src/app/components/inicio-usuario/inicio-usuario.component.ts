import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PresupuestosService } from '../../services/presupuestos.service';
import { Router } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';

@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit {
  presupuestos: any = [];
  idUsuario: string | null = null;

  constructor(
    private presupuestosService: PresupuestosService,
    private router: Router,
    private facebookService: FacebookService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuario = localStorage.getItem('IdUsuario');
      
      // Si el usuario no está autenticado, intentar autenticarse con Facebook
      if (!this.idUsuario) {
        this.facebookService.loginu()
          .then((authResponse) => {
            // Guarda el ID de usuario de Facebook en localStorage
            this.idUsuario = authResponse.userID;
            localStorage.setItem('IdUsuario', this.idUsuario);
            this.loadPresupuestos();
          })
          .catch(error => {
            console.error('Usuario no autenticado con Facebook:', error);
            this.router.navigate(['/login']);
          });
      } else {
        this.loadPresupuestos();
      }
    } else {
      console.warn('No se puede acceder a localStorage en el lado del servidor.');
      this.router.navigate(['/login']);
    }
  }

  loadPresupuestos() {
    if (this.idUsuario) {
      this.presupuestosService.getPresupuestos(this.idUsuario).subscribe(
        (resp: any) => {
          this.presupuestos = resp;
        },
        err => console.log(err)
      );
    }
  }
}
