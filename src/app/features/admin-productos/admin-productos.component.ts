import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ProductoServiceService} from '../../services/producto-service.service';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {Producto} from '../../Modelos/producto';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
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
  productoSeleccionado: Producto | null = null; // Producto que se está editando
  productoForm: FormGroup; // Formulario reactivo

  @ViewChild('selectTalla') selectTalla: ElementRef | undefined;
  @ViewChild('selectColor') selectColor: ElementRef | undefined;


  constructor(private productoService: ProductoServiceService, private fb: FormBuilder) {
    // Inicializa el formulario aquí
    this.productoForm = this.fb.group({
      id: [this.productoSeleccionado ? this.productoSeleccionado.id : null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', Validators.required],
      imagen: ['', Validators.required],
      sexo: ['', Validators.required],
      id_talla: ['', Validators.required],
      id_color: ['', Validators.required]
    });

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

  // agregarProducto() {
  //   console.log("Datos enviados:", this.nuevoProducto);  // Verificar los datos antes de enviarlos
  //
  //   if (!this.nuevoProducto) {
  //     console.error('Datos inválidos:', this.nuevoProducto);
  //     return;
  //   }
  //
  //   // Convertir talla y color a números antes de enviar
  //   const producto = {
  //     nombre: this.nuevoProducto.nombre,
  //     descripcion: this.nuevoProducto.descripcion,
  //     tipo: this.nuevoProducto.tipo,
  //     precio: this.nuevoProducto.precio,
  //     imagen: this.nuevoProducto.imagen,
  //     sexo: this.nuevoProducto.sexo,
  //     id_talla: Number(this.nuevoProducto.id_talla.id),  // Convertir talla a número
  //     id_color: Number(this.nuevoProducto.id_color.id)   // Convertir color a número
  //   };
  //
  //   // Enviar los datos convertidos al backend
  //   this.productoService.crearProducto(producto).subscribe(response => {
  //     console.log('Producto creado exitosamente:', response);
  //
  //     this.cargarProductos();  // Recargar la lista de productos
  //
  //     this.cancelarFormulario();  // Limpiar el formulario
  //   }, error => {
  //     console.error('Error al crear producto:', error);
  //   });
  // }
  agregarProducto() {
    console.log("Datos enviados:", this.nuevoProducto);  // Verificar los datos antes de enviarlos

    if (!this.nuevoProducto) {
      console.error('Datos inválidos:', this.nuevoProducto);
      return;
    }

    // Convertir talla y color a números antes de enviar
    const producto = {
      ...this.productoForm.value,   // Copia los valores del formulario
      id_talla: Number(this.productoForm.value.id_talla),  // Convierte id_talla a número
      id_color: Number(this.productoForm.value.id_color)   // Convierte id_color a número
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
      this.productoService.eliminarProducto(id).subscribe(() => {
        console.log('Producto eliminado exitosamente');
        this.cargarProductos();
      }, (error) => {
        console.error('Error al eliminar el producto:', error);
      });
    }
  }

  editarProducto(producto: Producto) {
    this.productoSeleccionado = {...producto};
    this.mostrarFormulario = true;
    this.productoForm.patchValue({
      ...producto,
      id_talla: producto.id_talla.id,
      id_color: producto.id_color.id
    });
  }

  guardarCambios() {
    if (this.productoSeleccionado) {
      console.log('Producto a enviar:', this.productoSeleccionado);

      const valueTalla = this.selectTalla?.nativeElement.value;
      const valueColor = this.selectColor?.nativeElement.value;

      // Enviar solo el ID de la talla y el color
      const producto = {
        ...this.productoForm.value,   // Copia los valores del producto a editar
        id_talla: valueTalla,
        id_color: valueColor
      };

      // Enviar los datos convertidos al backend
      this.productoService.editarProducto(producto).subscribe(response => {
        console.log('Producto actualizado exitosamente:', response);
        this.cargarProductos();
        this.cancelarFormulario();
      }, error => {
        console.error('Error al editar producto:', error);
      });
    }
  }



}
