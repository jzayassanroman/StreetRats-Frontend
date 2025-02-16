import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: []
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  navigateToAdminProducto() {
    this.router.navigate(['/adminproductos']); // Redirige a la página de inicio
  }
}
