import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsuarioService } from './usuario.service';

declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  constructor(
    private usuarioService: UsuarioService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFBSDK();
    }
  }

  loadFBSDK() {
    if ((window as any).FB) {
      return;  // Si el SDK ya está cargado, no lo cargues de nuevo
    }

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => this.initFB();
    document.body.appendChild(script);
  }

  initFB() {
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: '27673718282226678',  // Asegúrate de usar el App ID correcto
        cookie: true, // Habilita cookies para gestionar la sesión
        xfbml: true,
        version: 'v17.0'  // Usa la versión más reciente
      });
      console.log('Facebook SDK inicializado');
    };
  }

  loginu(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof FB !== 'undefined') {
        FB.login((response: any) => {
          if (response.authResponse) {
            resolve(response.authResponse); // Incluye el access_token en el authResponse
          } else {
            reject('No se pudo iniciar sesión');
          }
        }, { scope: 'email,public_profile' }); // Permisos solicitados
      } else {
        reject('El SDK de Facebook no está cargado.');
      }
    });
  }

  getUserData(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof FB !== 'undefined') {
        FB.api('/me', { fields: 'id,name,email', access_token: accessToken }, (response: any) => {
          if (response && !response.error) {
            resolve(response);
          } else {
            reject(response.error);
          }
        });
      } else {
        reject('El SDK de Facebook no está cargado.');
      }
    });
  }
}



/*import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
//import { AuthServices } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {
  constructor(private usuarioService: UsuarioService) {
    this.loadFBSDK();
  }

  loadFBSDK() {
    if ((window as any).FB) {
      return;  // Si ya está cargado, no lo cargues de nuevo
    }

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => this.initFB();
    document.body.appendChild(script);
  }

  initFB() {
    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId: '535558572428440',  // Asegúrate de que este sea tu App ID correcto
        cookie: true, // Habilitar cookies para gestionar la sesión
        xfbml: true,
        version: 'v17.0'  // Asegúrate de que la versión sea la correcta
      });
      console.log('Facebook SDK inicializado');
    };
  }

  // Método para iniciar sesión con Facebook
  loginu() {
    return new Promise((resolve, reject) => {
      (window as any).FB.login((response: any) => {
        if (response.usuarioRes) {
          // Obtén el userID en lugar del accessToken
          const userID = response.authResponse.userID;
          this.usuarioService.setUserID(userID); // Guarda el userID en AuthServices
          resolve(userID);
          //resolve(response.authResponse);
        } else {
          reject('No se pudo iniciar sesión en Facebook');
        }
      }, { scope: 'public_profile,email' });
    });
  }
  

  // Método para obtener los datos del perfil del usuario
  getUserData() {
    return new Promise((resolve, reject) => {
      (window as any).FB.api('/me', { fields: 'id,name,email,picture' }, (response: any) => {
        if (response && !response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }
}*/