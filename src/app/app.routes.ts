import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CrearCuentaComponent } from './features/crear-cuenta/crear-cuenta.component';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './features/home/home.component';



export const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  { path: 'crear-cuenta', component: CrearCuentaComponent },
  { path: 'login', component: LoginComponent },
];

