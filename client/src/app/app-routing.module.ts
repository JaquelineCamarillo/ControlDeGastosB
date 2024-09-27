import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrarseComponent } from './components/auth/registrarse/registrarse.component';
import { InicioUsuarioComponent } from './components/inicio-usuario/inicio-usuario.component';
import { GastoListComponent } from './components/gasto-list/gasto-list.component';
import { GastoFormComponent } from './components/gasto-form/gasto-form.component';
import { IngresoListComponent } from './components/ingreso-list/ingreso-list.component';
import { IngresoFormComponent } from './components/ingreso-form/ingreso-form.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'inicio-usuario', component: InicioUsuarioComponent },
  { path: 'gastos/list', component: GastoListComponent},
  { path: 'mapas', component: MapComponent},
  { path: 'gastos/add', component: GastoFormComponent},
  { path: 'gastos/edit/:id', component: GastoFormComponent },
  { path: 'ingresos/list', component: IngresoListComponent},
  { path: 'ingresos/add', component: IngresoFormComponent},
  { path: 'ingresos/edit/:id', component: IngresoFormComponent },
  { path: 'usuario', component: UsuarioComponent},
  { path: "resumen", component: ResumenComponent},
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

