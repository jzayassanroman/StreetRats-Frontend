import { Routes } from '@angular/router';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {HomeComponent} from './features/home/home.component';
import {PaginaProductoComponent} from './features/pagina-producto/pagina-producto.component';



export const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'productos', component: PaginaProductoComponent}



];
