import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
    private productService: ProductService
  ) {}

  ngOnInit() {
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
      imagen: this.producto.imagenes[0] || '' // Tomamos la primera imagen del producto
    };

    // Verificar si el producto ya está en el carrito con la misma talla
    const index = this.carrito.findIndex(p => p.id === productoCarrito.id && p.talla === productoCarrito.talla);
    if (index !== -1) {
      this.carrito[index].cantidad += this.cantidad;
    } else {
      this.carrito.push(productoCarrito);
    }

    // Guardar en LocalStorage
    localStorage.setItem('carrito', JSON.stringify(this.carrito));


    // Mostrar carrito
    this.toggleCarrito();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
