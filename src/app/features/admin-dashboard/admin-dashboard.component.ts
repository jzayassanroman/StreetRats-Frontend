import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: []
})
export class AdminDashboardComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService,) {}

  navigateToAdminProducto() {
    this.router.navigate(['/adminproductos']); // Redirige a la página de inicio
  }
  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
