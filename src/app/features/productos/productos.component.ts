import { Component, OnInit } from '@angular/core';
import { Producto, ProductService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, RouterLink],
  styleUrls: ['./productos.component.css'],
  providers: [ProductService]
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  currentIndexes: { [key: number]: number } = {};
  categorias: { [key: string]: Producto[] } = {
    'Nuevos Productos': [],
    'Mejor Valorados': [],
    'Hecho por StreetRats': [],
    'Para el Verano': [],
    'Para el Otoño': [],
    'Para el Invierno': [],
    'Para la Primavera': []
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe((data) => {
      this.productos = data.map(producto => ({
        ...producto,
        imagenes: producto.imagenes ?? [] // Asegurar que siempre haya un array de imágenes
      }));

      // Ordenar productos por ID descendente
      this.productos.sort((a, b) => b.id - a.id);

      // Obtener los últimos 80 productos
      this.categorias["Nuevos Productos"] = this.productos.slice(0, 80);

      // Inicializar índices del carrusel
      this.productos.forEach(producto => {
        this.currentIndexes[producto.id] = 0;
      });

      // Definir manualmente las categorías
      const productosStreetRats = [1, 2, 3, 4];
      const productosMejorValorados = [1, 2, 3, 4];
      const productosVerano = [1, 2, 3, 4];
      const productosOtono = [1, 2, 3, 4];
      const productosInvierno = [1, 2, 3, 4];
      const productosPrimavera = [1, 2, 3, 4];

      // Asignar productos a sus categorías manualmente
      this.productos.forEach(producto => {
        if (productosStreetRats.includes(producto.id)) {
          this.categorias["Hecho por StreetRats"].push(producto);
        }
        if (productosMejorValorados.includes(producto.id)) {
          this.categorias["Mejor Valorados"].push(producto);
        }
        if (productosVerano.includes(producto.id)) {
          this.categorias["Para el Verano"].push(producto);
        }
        if (productosOtono.includes(producto.id)) {
          this.categorias["Para el Otoño"].push(producto);
        }
        if (productosInvierno.includes(producto.id)) {
          this.categorias["Para el Invierno"].push(producto);
        }
        if (productosPrimavera.includes(producto.id)) {
          this.categorias["Para la Primavera"].push(producto);
        }
      });
    });
  }

  prevSlide(productoId: number): void {
    if (this.productos.length === 0) return;
    const total = this.productos.find(p => p.id === productoId)?.imagenes.length ?? 0;
    this.currentIndexes[productoId] = this.currentIndexes[productoId] === 0 ? total - 1 : this.currentIndexes[productoId] - 1;
  }

  nextSlide(productoId: number): void {
    if (this.productos.length === 0) return;
    const total = this.productos.find(p => p.id === productoId)?.imagenes.length ?? 0;
    this.currentIndexes[productoId] = this.currentIndexes[productoId] === total - 1 ? 0 : this.currentIndexes[productoId] + 1;
  }
}
