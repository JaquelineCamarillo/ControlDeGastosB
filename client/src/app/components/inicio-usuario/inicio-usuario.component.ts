import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PresupuestosService } from '../../services/presupuestos.service';
import { Router } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-inicio-usuario',
  templateUrl: './inicio-usuario.component.html',
  styleUrls: ['./inicio-usuario.component.css']
})
export class InicioUsuarioComponent implements OnInit {
  presupuestos: any = [];
  idUsuario: string | null = null;
  isChatbotLoaded = false;  // Para evitar cargar el script múltiples veces

  constructor(
    private presupuestosService: PresupuestosService,
    private router: Router,
    private facebookService: FacebookService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Verifica que estamos en el navegador antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.idUsuario = localStorage.getItem('IdUsuario');
      
      // Si el usuario no está autenticado, intentar autenticarse con Facebook
      if (!this.idUsuario) {
        this.facebookService.loginu()
          .then((authResponse) => {
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

  loadCliengoChatbot() {
    if (!this.isChatbotLoaded && isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script');
      script.src =   'https://s.cliengo.com/weboptimizer/672ae167790b8626f6ba5222/672ae2c706341930febce139.js?platform=view_installation_code',
      script.async = true;
      this.renderer.appendChild(document.body, script);
      this.isChatbotLoaded = true;  // Evita cargar el script nuevamente
    }
  }
    /*getChatGPTResponse(message: string): Observable<any> {
      return this.http.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      }, {
        headers: { 'Authorization': `Bearer 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` }
      });
    }*/
}
