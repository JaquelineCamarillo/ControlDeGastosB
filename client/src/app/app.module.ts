import localeEs from '@angular/common/locales/es';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrarseComponent } from './components/auth/registrarse/registrarse.component';
import { HomeComponent } from './components/home/home.component';
import { InicioUsuarioComponent } from './components/inicio-usuario/inicio-usuario.component';
import { GastoFormComponent } from './components/gasto-form/gasto-form.component';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { IngresoFormComponent } from './components/ingreso-form/ingreso-form.component';
import { IngresoListComponent } from './components/ingreso-list/ingreso-list.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { MapComponent } from './components/map/map.component';
import { EmailService } from './services/email.service'; 
import { TwitchComponent } from './components/twitch/twitch.component';
import { SafeUrlPipe } from './safe-url.pipe';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrarseComponent,
    MapComponent,
    InicioUsuarioComponent,
    GastoFormComponent,
    GastoListComponent,
    IngresoFormComponent,
    IngresoListComponent,
    UsuarioComponent,
    ResumenComponent,
    TwitchComponent,
    SafeUrlPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    provideHttpClient(withFetch()),
    EmailService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }