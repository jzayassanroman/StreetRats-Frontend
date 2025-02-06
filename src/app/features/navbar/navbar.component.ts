import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  standalone: true,
  providers: [AuthService]
})
export class NavbarComponent {
  carritoAbierto: boolean = false;
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Verifica si hay token guardado
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  navigateToProfile() {
    this.router.navigate(['/perfil']); // Redirige a la página de perfil
  }

  navigateToHome() {
    this.router.navigate(['']); // Redirige a la página de inicio
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Redirige a la página de inicio
  }
  navigateToAbout() {
    this.router.navigate(['/about-us']); // Redirige a la página de inicio
  }
}
