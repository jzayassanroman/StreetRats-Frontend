import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  carritoAbierto: boolean = false;
  private router = inject(Router);

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }
  redirectToHomePage() {
    this.router.navigate(['/']);
  }

  redirectToAboutUs() {
    this.router.navigate(['/about-us']);
  }
}

