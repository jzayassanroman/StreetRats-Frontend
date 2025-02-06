import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Producto } from '../../services/producto.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ValoracionesService} from '../../services/valoraciones.service';

@Component({
  selector: 'app-productoin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './productoin.component.html',
  styleUrls: ['./productoin.component.css'],
  providers: [ProductService,ValoracionesService]
})
export class ProductoinComponent implements OnInit {
  producto: Producto | null = null;
  cantidad: number = 1;
  tallaSeleccionada: string | null = null;
  estrellasSeleccionadas: number = 0;
  comentario: string = '';
  valoraciones: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private valoracionesService: ValoracionesService
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
      this.cargarValoraciones(+id);
    }
  }
  cargarValoraciones(idProducto: number) {
    this.valoracionesService.obtenerValoraciones(idProducto).subscribe((data) => {
      this.valoraciones = data;
    });
  }

  seleccionarEstrellas(estrellas: number) {
    this.estrellasSeleccionadas = estrellas;
  }

  enviarValoracion() {
    if (!this.producto) return;

    const valoracionData = {
      id_producto: this.producto.id,
      id_cliente: 1, // Esto se debe cambiar por el cliente autenticado
      estrellas: this.estrellasSeleccionadas,
      valoracion: this.comentario,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.valoracionesService.enviarValoracion(valoracionData).subscribe(() => {
      alert('Valoración enviada correctamente');
      this.comentario = '';
      this.estrellasSeleccionadas = 0;
      this.cargarValoraciones(this.producto!.id); // Refrescar las valoraciones
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


}
