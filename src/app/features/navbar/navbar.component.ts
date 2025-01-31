import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  carritoAbierto: boolean = false;

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }
}
