import { Component, OnInit } from '@angular/core';
import { Producto, ProductService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  currentIndexes: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProductos().subscribe((data) => {
      this.productos = data.map(producto => ({
        ...producto,
        imagenes: producto.imagenes ?? [] // Asegura que siempre sea un array
      }));
      this.currentIndexes = new Array(this.productos.length).fill(0);
    });
  }

  prevSlide(index: number): void {
    this.currentIndexes[index] =
      this.currentIndexes[index] === 0
        ? this.productos[index].imagenes.length - 1
        : this.currentIndexes[index] - 1;
  }

  nextSlide(index: number): void {
    this.currentIndexes[index] =
      this.currentIndexes[index] === this.productos[index].imagenes.length - 1
        ? 0
        : this.currentIndexes[index] + 1;
  }
}
