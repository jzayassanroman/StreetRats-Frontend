// src/app/app.component.ts
import { Component } from '@angular/core';
import {CrearCuentaComponent} from './features/crear-cuenta/crear-cuenta.component';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './features/login/login.component';
import {NavbarComponent} from './features/navbar/navbar.component';
import {AboutUsComponent} from './features/about-us/about-us.component';
import {FooterComponent} from './features/footer/footer.component';
import {PaginaProductoComponent} from './features/pagina-producto/pagina-producto.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    CrearCuentaComponent,
    RouterOutlet,
    HttpClientModule,
    NavbarComponent,
    FooterComponent,
    PaginaProductoComponent
    // LoginComponent
  ],
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'StreetRatsFront';
}
