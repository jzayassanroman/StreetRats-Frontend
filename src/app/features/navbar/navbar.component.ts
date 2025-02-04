import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  carritoAbierto: boolean = false;
  carrito: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.cargarCarrito();

    // Escuchar eventos de actualización del carrito
    window.addEventListener('carritoActualizado', () => {
      this.cargarCarrito();
    });
  }

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));

    // Disparar el evento para actualizar otras partes de la app
    window.dispatchEvent(new Event('carritoActualizado'));
  }
}
