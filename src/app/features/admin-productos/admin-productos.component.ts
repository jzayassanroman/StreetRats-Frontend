import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ProductoServiceService} from '../../services/producto-service.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {Producto} from '../../Modelos/producto';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css'
})

export class AdminProductosComponent implements OnInit {
  tipos: string[] = [];
  mostrarFormulario: boolean = false;
  productos: Producto[] = [];
  nuevoProducto: Producto = {
    nombre: '',
    descripcion: '',
    tipo: '',
    precio: 0,
    imagen: '',
    sexo: '',
    id_color: {id: 0, descripcion: ''},
    id_talla: {id: 0, descripcion: ''}
  };

  id_talla: any[] = [];
  id_color: any[] = [];
  sexos: any[] = [];

  constructor(private productoService: ProductoServiceService) {
  }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    forkJoin({
      tallas: this.productoService.getTallas(),
      colores: this.productoService.getColores(),
      sexos: this.productoService.getSexos(),
      tipos: this.productoService.getTipos(), // 🔹 Cargar tipos
      productos: this.productoService.getProductos()

    }).subscribe(({tallas, colores, sexos, tipos, productos}) => {
      this.id_talla = tallas;
      this.id_color = colores;
      this.sexos = sexos;
      this.tipos = tipos; // 🔹 Asignar tipos
      console.log('Colores cargados:', this.id_color); // Verifica que los colores se carguen
      console.log('Tallas cargadas:', this.id_talla); // Verifica que las tallas se carguen

      this.productos = productos;

      console.log('Productos final:', this.productos);
    });
  }

  agregarProducto() {
    console.log("Datos enviados:", this.nuevoProducto);  // Verificar los datos antes de enviarlos

    if (!this.nuevoProducto) {
      console.error('Datos inválidos:', this.nuevoProducto);
      return;
    }

    // Convertir talla y color a números antes de enviar
    const producto = {
      nombre: this.nuevoProducto.nombre,
      descripcion: this.nuevoProducto.descripcion,
      tipo: this.nuevoProducto.tipo,
      precio: this.nuevoProducto.precio,
      imagen: this.nuevoProducto.imagen,
      sexo: this.nuevoProducto.sexo,
      id_talla: Number(this.nuevoProducto.id_talla.id),  // Convertir talla a número
      id_color: Number(this.nuevoProducto.id_color.id)   // Convertir color a número
    };

    // Enviar los datos convertidos al backend
    this.productoService.crearProducto(producto).subscribe(response => {
      console.log('Producto creado exitosamente:', response);

      this.cargarProductos();  // Recargar la lista de productos

      this.cancelarFormulario();  // Limpiar el formulario
    }, error => {
      console.error('Error al crear producto:', error);
    });
  }


  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      tipo: '',
      precio: 0,
      imagen: '',
      sexo: '',
      id_color: {id: 0, descripcion: ''},
      id_talla: {id: 0, descripcion: ''}
    };
  }

  eliminarProducto(id: number | undefined) {
    if (id === undefined) {
      console.error('El ID del producto es undefined');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          console.log('Producto eliminado exitosamente');
          this.cargarProductos(); // Recargar la lista de productos después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      });
    }
  }

}
