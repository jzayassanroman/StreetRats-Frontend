import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {CartService} from '../../services/cartService';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-productoin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productoin.component.html',
  styleUrls: ['./productoin.component.css'],
  providers: [ProductService]
})
export class ProductoinComponent implements OnInit {
  producto: Producto | null = null;
  cantidad: number = 1;
  tallaSeleccionada: string | null = null;
  carrito: any[] = [];
  carritoAbierto: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService:CartService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      console.log("Carrito actualizado:", cart); // ✅ Verifica que se actualiza
      this.carrito = cart;
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductoById(+id).subscribe((data) => {
        this.producto = {
          ...data,
          imagenes: typeof data.imagenes === 'string' ? JSON.parse(data.imagenes) : data.imagenes
        };
      });
    }

    // Cargar carrito desde LocalStorage si existe
    const carritoGuardado = localStorage.getItem('carrito');
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  cambiarCantidad(valor: number) {
    if (this.cantidad + valor > 0) {
      this.cantidad += valor;
    }
  }

  seleccionarTalla(talla: string) {
    this.tallaSeleccionada = talla;
  }

  toggleCarrito() {
    this.carritoAbierto = !this.carritoAbierto;
  }

  agregarAlCarrito() {
    if (!this.producto || !this.tallaSeleccionada) {
      alert('Selecciona una talla antes de añadir al carrito.');
      return;
    }

    const productoCarrito = {
      id: this.producto.id,
      nombre: this.producto.nombre,
      precio: this.producto.precio,
      talla: this.tallaSeleccionada,
      cantidad: this.cantidad,
      imagen: this.producto.imagenes?.[0] || ''
    };

    this.cartService.addToCart(productoCarrito);
    this.cdr.detectChanges()// Usamos el servicio
  }

}
