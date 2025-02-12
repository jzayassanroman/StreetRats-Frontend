import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Producto } from '../../services/producto.service';
import { ValoracionesService } from '../../services/valoraciones.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cartService';

@Component({
  selector: 'app-productoin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productoin.component.html',
  styleUrls: ['./productoin.component.css'],
  providers: [ProductService, ValoracionesService]
})
export class ProductoinComponent implements OnInit {
  producto: Producto | null = null;
  cantidad: number = 1;
  tallaSeleccionada: string | null = null;
  estrellasSeleccionadas: number = 0;
  mediaEstrellas: number = 0;
  comentario: string = '';
  valoraciones: any[] = [];
  carrito: any[] = [];
  carritoAbierto: boolean = false;
  idProducto: number | undefined ; // Asegúrate de obtener el ID del producto correctamente

  constructor(
    private route: ActivatedRoute,
    private valoracionesService: ValoracionesService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idProducto = +params['id'];
      this.cargarValoraciones(this.idProducto);
    });

    this.cartService.cart$.subscribe(cart => {
      console.log("Carrito actualizado:", cart); // ✅ Verifica que se actualiza
      this.carrito = cart;
    });
    window.scrollTo(0, 0); // Esto asegura que la vista empiece desde arriba

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductoById(+id).subscribe((data) => {
        this.producto = {
          ...data,
          imagenes: typeof data.imagen === 'string' ? JSON.parse(data.imagen) : data.imagen
        };
      });
    }

    // Cargar carrito desde LocalStorage si existe
    const carritoGuardado = localStorage.getItem('carrito');
    this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  cargarValoraciones(idProducto: number) {
    this.valoracionesService.obtenerValoraciones(idProducto).subscribe((data) => {
      this.valoraciones = data;
      this.calcularMediaEstrellas();
    });
  }

  calcularMediaEstrellas() {
    if (this.valoraciones.length > 0) {
      const totalEstrellas = this.valoraciones.reduce((acc, valoracion) => acc + valoracion.estrellas, 0);
      this.mediaEstrellas = totalEstrellas / this.valoraciones.length;
    } else {
      this.mediaEstrellas = 0;
    }
  }

  seleccionarEstrellas(estrellas: number) {
    this.estrellasSeleccionadas = estrellas;
  }

  enviarValoracion() {
    if (!this.producto) return;

    const valoracionData = {
      id_producto: this.producto.id,
      id_cliente: localStorage.getItem('userId'), // Esto se debe cambiar por el cliente autenticado
      estrellas: this.estrellasSeleccionadas,
      valoracion: this.comentario,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.valoracionesService.enviarValoracion(valoracionData).subscribe(() => {
      Swal.fire({
        title: '¡Gracias por tu valoración!',
        text: 'Tu comentario ha sido enviado con éxito.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        timer: 3000,
        timerProgressBar: true
      });

      this.comentario = '';
      this.estrellasSeleccionadas = 0;
      if (this.producto) {
        this.cargarValoraciones(this.producto.id); // Refrescar las valoraciones
      }
    });
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
    this.cdr.detectChanges(); // Usamos el servicio
  }

  protected readonly Math = Math;
}
