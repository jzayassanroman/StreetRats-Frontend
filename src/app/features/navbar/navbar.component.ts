import { Component, OnInit } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {Router} from '@angular/router';
import {CartService} from '../../services/cartService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule,CurrencyPipe],
  standalone: true,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  carritoAbierto: boolean = false;
  carrito: any[] = [];

  constructor(private router:Router, protected cartService:CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.carrito = cart;
    });
    if(this.carrito.length === 0) {
      this.carrito = this.cartService.getCart();
    }
  }
  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    console.log("Carrito guardado:", carritoGuardado);
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  eliminarDelCarrito(index: number) {
    this.cartService.removeFromCart(index);
  }


  navigateToProductos(){
    this.router.navigate(['/listadoproducto']);
  }
  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

}
