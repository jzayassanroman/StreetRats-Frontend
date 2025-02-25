import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {CartService} from '../../services/cartService';
import {FormsModule} from '@angular/forms';
import {Producto, ProductService} from '../../services/producto.service';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {BusquedaService} from '../../services/busqueda.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, CurrencyPipe, FormsModule],
  standalone: true,
  styleUrls: ['./navbar.component.css'],

  providers: [AuthService]
})
export class NavbarComponent implements OnInit {
  carritoAbierto: boolean = false;
  isLoggedIn: boolean = false;
  carrito: any[] = [];
  showSearch: boolean = false;
  searchQuery: string = '';
  productos: any[] = [];
  searchPerformed: boolean = false;  // Bandera para rastrear si se ha hecho búsqueda
  productosFiltrados: Producto[] = [];
  showError: boolean = false;  // Variable para controlar si mostrar el mensaje de error
  busqueda: string = ''; // Valor de la búsqueda
  searchTerm: string = '';

  constructor(public authService: AuthService, private router: Router, protected cartService:CartService,private productoService: ProductService,
    private cdRef: ChangeDetectorRef,private busquedaService: BusquedaService) {}


  toggleSearch() {
    this.showSearch = !this.showSearch;

    if (!this.showSearch) {
      this.searchTerm = '';

      // Recargar solo si estamos en 'home'
      if (this.router.url === '' || this.router.url === '') {
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate([this.router.url]);
          // Convertir a window.location
          // window.location.href = this.router.url;
        });
      }
    }
  }


  cargarProductos() {
    forkJoin({
      tallas: this.productoService.getTallas(),
      sexos: this.productoService.getSexos(),
      productos: this.productoService.getProductos()
    }).subscribe(({productos }) => {
      console.log("Productos recibidos:", productos);
      this.productos = productos.map(producto => ({
        ...producto,
        descripcion: producto.descripcion || 'Sin descripción',
        imagenes: producto.imagenes || [] // Asegúrate de que imagenes es un array
      }));
      this.productosFiltrados = [...this.productos];

      console.log('Productos final:', this.productosFiltrados);

      this.cdRef.detectChanges(); // 🔹 Forzar actualización en la vista
    });
  }


  // Función para buscar productos (se ejecuta al hacer clic en el botón de búsqueda)
  buscar() {
    if (this.searchTerm.trim()) {
      this.busquedaService.setSearchTerm(this.searchTerm);
    }
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

  ngOnInit(): void {
    this.searchQuery = '';
    this.productos = [];

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSearch = false;  // Ocultar la barra al cambiar de página
        this.searchTerm = '';     // Limpiar el campo de búsqueda

        // Recargar cuando se regresa a la página de inicio
        if (event.url === '/' || event.urlAfterRedirects === '/') {
          // Navegar a la misma ruta para recargar
          this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
          });
        }
      }
    });
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
}
