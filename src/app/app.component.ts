import { Component } from '@angular/core';
import { CrearCuentaComponent } from './features/crear-cuenta/crear-cuenta.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './features/navbar/navbar.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { FooterComponent } from './features/footer/footer.component';
import { CommonModule } from '@angular/common';
import {ProductosComponent} from './features/productos/productos.component';
import {EditarClienteComponent} from './features/editar-cliente/editar-cliente.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [
    CrearCuentaComponent,
    RouterOutlet,
    HttpClientModule,
    NavbarComponent,
    FooterComponent,
    ProductosComponent,
    CommonModule,
    EditarClienteComponent

    // LoginComponent
  ],
})
export class AppComponent {
  title = 'StreetRatsFront';
  showNavbarFooter: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbarFooter = !event.url.includes('/admindashboard') && !event.url.includes('/adminproductos');
      }
    });
  }
}
