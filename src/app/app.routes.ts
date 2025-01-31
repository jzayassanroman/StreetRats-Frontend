import { Routes } from '@angular/router';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './features/home/home.component';
import {AdminProductosComponent} from './features/admin-productos/admin-productos.component';



export const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'adminproductos', component: AdminProductosComponent}




];
