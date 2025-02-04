import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Producto } from '../../services/producto.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

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
  }


  cambiarCantidad(valor: number) {
    if (this.cantidad + valor > 0) {
      this.cantidad += valor;
    }
  }

  seleccionarTalla(talla: string) {
    this.tallaSeleccionada = talla;
  }


}
