import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, CurrencyPipe, NgClass} from '@angular/common';
import {CartService} from '../../services/cartService';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgClass,
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrls: ['./navbar.component.css'],

  providers: [AuthService]
})
export class NavbarComponent implements OnInit {
  carritoAbierto: boolean = false;
  isLoggedIn: boolean = false;
  carrito: any[] = [];

  constructor(public authService: AuthService, private router: Router,
              protected cartService:CartService,
              private cdRef: ChangeDetectorRef) {}

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Verifica si hay token guardado
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      console.log('Navbar - Estado de autenticación:', status);
      this.isLoggedIn = status;
      this.cdRef.detectChanges();
    });
    this.checkLoginStatus();
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

  navigateToPayment() {
    this.router.navigate(['/payment']); // Redirige a la página de inicio
  }
  navigateToProducto() {
    this.router.navigate(['/listadoproducto']); // Redirige a la página de inicio
  }
  navigateToTiendas() {
    this.router.navigate(['/tiendas']); // Redirige a la página de inicio
  }
  navigateToEditarPerfil() {
    this.router.navigate(['/editar-cliente']); // Redirige a la página de inicio
  }
}
