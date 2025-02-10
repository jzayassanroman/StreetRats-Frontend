import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {CartService} from '../../services/cartService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule,CurrencyPipe],
  standalone: true,
  styleUrls: ['./navbar.component.css']

  providers: [AuthService]
})
export class NavbarComponent implements OnInit {
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
