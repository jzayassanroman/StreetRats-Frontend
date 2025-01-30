import { Routes } from '@angular/router';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './features/home/home.component';



export const routes: Routes = [

  {path: '', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},



];
