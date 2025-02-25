import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Producto, ProductService} from '../services/producto.service';
import {CommonModule, KeyValuePipe, NgClass, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms'; // Asegúrate de que el nombre es correcto

@Component({
  selector: 'app-productos-filtrados',
  templateUrl: './productos-filtrados.component.html',
  imports: [
    NgClass,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./productos-filtrados.component.css']
})
export class ProductosFiltradosComponent implements OnInit {
  filtroTipo: string = '';
  filtroSexo: string = '';
  filtroTalla: string = '';
  precioMin?: number;
  precioMax?: number;
  tipo:string='';
  tipos: string[] = [];
  sexos: string[] = [];
  tallas: any[] = [];  // Cambiado a cualquier tipo para manejar los objetos con id y descripción
  colores: any[] = [];  // Cambiado a cualquier tipo para manejar los objetos con id y descripción
  preciosMinimos: number[] = [];
  preciosMaximos: number[] = [];
  smoothTransition = true;



  productosFiltrados: Producto[] = []; // Los productos filtrados
  currentIndexes: { [key: number]: number } = {}; // Índices para las imágenes

  constructor(
    private activatedRoute: ActivatedRoute,  // Inyectamos ActivatedRoute para leer los parámetros
    private productoService: ProductService // Asegúrate de que el nombre del servicio sea correcto
  ) { }


  ngOnInit(): void {
    this.cargarFiltros();
    this.filtroTipo = this.productosFiltrados.length > 0 ? this.productosFiltrados[0].tipo : '';
    // Obtenemos el parámetro de la URL
    this.activatedRoute.queryParams.subscribe(params => {
      const categoriaSeleccionada = params['tipo'];

      if(categoriaSeleccionada!= null || categoriaSeleccionada!=''){
        localStorage.setItem('tipo',categoriaSeleccionada);
      }


      if (categoriaSeleccionada) {
        // Filtramos los productos según la categoría seleccionada
        this.productoService.getProductosPorTipo(categoriaSeleccionada).subscribe(
          productos => {
            // Actualizamos la lista de productos filtrados
            this.productosFiltrados = productos;

            // Inicializa el índice para las imágenes después de obtener los productos
            this.productosFiltrados.forEach(producto => {
              if (producto.imagenes && producto.imagenes.length > 0) {
                this.currentIndexes[producto.id] = 0; // Empieza con la primera imagen
              }
            });
          },
          error => {
            console.error('Error al obtener los productos filtrados:', error);
            // Manejo de error, podrías mostrar un mensaje de error al usuario aquí
          }
        );
      }
    });
  }

  cargarFiltros() {
    this.productoService.getSexos().subscribe(sexos => this.sexos = sexos);
    this.productoService.getTallas().subscribe(tallas => this.tallas = tallas);
    this.productoService.getPrecios().subscribe(precios => {
      this.preciosMinimos = [precios.precioMin, precios.precioMin + 10, precios.precioMin + 20, precios.precioMin + 50];
      this.preciosMaximos = [precios.precioMax, precios.precioMax - 50, precios.precioMax - 20, precios.precioMax - 10].reverse();
    });
  }
  aplicarFiltros() {
    console.log('Filtros aplicados:', {
      tipo: this.tipo,
      sexo: this.filtroSexo,
      talla: this.filtroTalla,
      precioMin: this.precioMin,
      precioMax: this.precioMax
    });

    this.productoService.filtrarProductos(
      this.tipo, // 🔥 Asegurar que el tipo seleccionado se mantiene
      this.filtroSexo,
      this.filtroTalla,
      this.precioMin,
      this.precioMax
    ).subscribe((productos: Producto[]) => {
      this.productosFiltrados = productos.map((producto: Producto) => ({
        ...producto,
        imagenes: producto.imagenes ?? [] // Ahora accedemos a 'producto.imagenes'
        }));
      });
  }



  prevSlide(productoId: number): void {
    if (this.productosFiltrados.length === 0) return;
    const total = this.productosFiltrados.find(p => p.id === productoId)?.imagenes.length ?? 0;
    this.currentIndexes[productoId] = this.currentIndexes[productoId] === 0 ? total - 1 : this.currentIndexes[productoId] - 1;
  }

  nextSlide(productoId: number): void {
    if (this.productosFiltrados.length === 0) return;
    const total = this.productosFiltrados.find(p => p.id === productoId)?.imagenes.length ?? 0;
    this.currentIndexes[productoId] = this.currentIndexes[productoId] === total - 1 ? 0 : this.currentIndexes[productoId] + 1;
  }

}
