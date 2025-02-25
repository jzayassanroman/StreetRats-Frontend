import {Component, Input, OnInit} from '@angular/core';
import {Producto, ProductService, TipoProducto} from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import {BusquedaService} from '../../services/busqueda.service';
import {ValoracionesService} from '../../services/valoraciones.service';

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
  @Input() productos1: Producto[] = [];
  tiposDisponibles = Object.values(TipoProducto);
  tipoSeleccionado: TipoProducto | null = null;
  currentIndexes: { [key: number]: number } = {};
  productosVisibles: { [key: string]: number } = {};
  productosPorPagina = 8; // Límite inicial de productos por categoría

  categorias: { [key: string]: Producto[] } = {
    'Nuevos Productos': [],
    'Mejor Valorados': [],
    'Hecho por StreetRats': [],
    'Para el Verano': [],
    'Para el Otoño': [],
    'Para el Invierno': [],
    'Para la Primavera': []
  };

  cargarProductos(): void {
    if (this.tipoSeleccionado) {
      this.productService.getProductosPorTipo(this.tipoSeleccionado).subscribe((data) => {
        this.productos = data;
      });
    } else {
      this.productService.getProductos().subscribe((data) => {
        this.productos = data;
      });
    }
  }
  seleccionarTipo(tipo: TipoProducto): void {
    this.tipoSeleccionado = tipo;
    this.cargarProductos();
  }

  constructor(private productService: ProductService, private busquedaService: BusquedaService,private valoracionesService: ValoracionesService) {}

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
      this.productos.forEach((producto: Producto) => {
        this.currentIndexes[producto.id] = 0;
      });

      // Asignar productos a sus categorías manualmente
      const productosStreetRats = [1, 2, 3, 4];
      const productosMejorValorados = [1, 2, 3, 4];
      const productosVerano = [1, 2, 3, 4];
      const productosOtono = [1, 2, 3, 4];
      const productosInvierno = [1, 2, 3, 4];
      const productosPrimavera = [1, 2, 3, 4];

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

      // Inicializar cantidad de productos visibles por categoría
      for (const key in this.categorias) {
        this.productosVisibles[key] = this.productosPorPagina;
      }
    });
  }

  verMas(categoria: string): void {
    this.productosVisibles[categoria] += this.productosPorPagina;
  }

  verMenos(categoria: string): void {
    if (this.productosVisibles[categoria] > this.productosPorPagina) {
      this.productosVisibles[categoria] -= this.productosPorPagina;
    }
  }

  ordenarCategorias(a: any, b: any): number {
    const ordenPersonalizado = [
      'Nuevos Productos',
      'Mejor Valorados',
      'Hecho por StreetRats',
      'Para el Verano',
      'Para el Otoño',
      'Para el Invierno',
      'Para la Primavera'
    ];
    return ordenPersonalizado.indexOf(a.key) - ordenPersonalizado.indexOf(b.key);
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
