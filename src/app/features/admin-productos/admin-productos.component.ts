import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  standalone: true,
  styleUrl: './admin-productos.component.css'
})

export class AdminProductosComponent implements OnInit {
  tipos: string[] = [];
  mostrarFormulario: boolean = false;
  mostrarFormularioTalla: boolean = false;
  mostrarFormularioColor: boolean = false;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; // Productos filtrados para mostrar
  busqueda: string = ''; // Valor de la búsqueda
  filtroTipo: string = ''; // Filtro por tipo
  filtroSexo: string = ''; // Filtro por sexo
  nuevoProducto: Producto = {
    nombre: '',
    descripcion: '',
    tipo: '',
    precio: 0,
    imagen: '',
    sexo: '',
    color: {id: 0, descripcion: ''},
    talla: {id: 0, descripcion: ''}
  };
  nuevoColor: string = ''; // Inicializar como string
  nuevaTalla: string = ''; // Inicializar como string

  talla: any[] = [];
  color: any[] = [];
  sexos: any[] = [];
  productoSeleccionado: Producto | null = null; // Producto que se está editando
  productoForm: FormGroup; // Formulario reactivo

  @ViewChild('selectTalla') selectTalla: ElementRef | undefined;
  @ViewChild('selectColor') selectColor: ElementRef | undefined;


  constructor(private productoService: ProductoServiceService, private fb: FormBuilder,private cdRef: ChangeDetectorRef) {
    // Inicializa el formulario aquí
    this.productoForm = this.fb.group({
      id: [this.productoSeleccionado ? this.productoSeleccionado.id : null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', Validators.required],
      imagen: ['', Validators.required],
      sexo: ['', Validators.required],
      talla: ['', Validators.required],
      color: ['', Validators.required]
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
      this.talla = tallas;
      this.color = colores;
      this.sexos = sexos;
      this.tipos = tipos; // 🔹 Asignar tipos
      this.productos = productos;
      this.productosFiltrados = [...productos]; // Asegurar copia independiente
      console.log('Colores cargados:', this.color); // Verifica que los colores se carguen
      console.log('Tallas cargadas:', this.talla); // Verifica que las tallas se carguen

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
  //     talla: Number(this.nuevoProducto.talla.id),  // Convertir talla a número
  //     color: Number(this.nuevoProducto.color.id)   // Convertir color a número
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
      talla: Number(this.productoForm.value.talla),  // Convierte talla a número
      color: Number(this.productoForm.value.color)   // Convierte color a número
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
      color: {id: 0, descripcion: ''},
      talla: {id: 0, descripcion: ''}
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

  // editarProducto(producto: Producto) {
  //   this.productoSeleccionado = {...producto};
  //   this.mostrarFormulario = true;
  //   this.productoForm.patchValue({
  //     ...producto,
  //     talla: producto.talla.id,
  //     color: producto.color.id
  //   });
  // }

  editarProducto(producto: Producto) {
    this.productoSeleccionado = { ...producto }; // Clonamos el producto seleccionado
    this.mostrarFormulario = true;

    // Cargamos las propiedades correctamente
    this.productoForm.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      tipo: producto.tipo,
      precio: producto.precio,
      imagen: producto.imagen,
      sexo: producto.sexo,
      talla: producto.talla?.id, // Asignamos solo el ID de la talla
      color: producto.color?.id  // Asignamos solo el ID del color
    });

    console.log('Producto cargado en el formulario:', this.productoForm.value);
  }





  // guardarCambios() {
  //   if (this.productoSeleccionado) {
  //     console.log('Producto a enviar:', this.productoSeleccionado);
  //
  //     const valueTalla = this.selectTalla?.nativeElement.value;
  //     const valueColor = this.selectColor?.nativeElement.value;
  //
  //     // Enviar solo el ID de la talla y el color
  //     const producto = {
  //       ...this.productoForm.value,   // Copia los valores del producto a editar
  //       talla: valueTalla,
  //       color: valueColor
  //     };
  //
  //     // Enviar los datos convertidos al backend
  //     this.productoService.editarProducto(producto).subscribe(response => {
  //       console.log('Producto actualizado exitosamente:', response);
  //       this.cargarProductos();
  //       this.cancelarFormulario();
  //     }, error => {
  //       console.error('Error al editar producto:', error);
  //     });
  //   }
  // }
  guardarCambios() {
    if (this.productoSeleccionado) {
      const productoEditado = {
        ...this.productoForm.value, // Obtiene los valores del formulario
        talla: this.productoForm.value.talla ? Number(this.productoForm.value.talla) : null,
        color: this.productoForm.value.color ? Number(this.productoForm.value.color) : null
      };

      console.log('Producto editado antes de enviar:', productoEditado);

      this.productoService.editarProducto(productoEditado).subscribe(response => {
        console.log('Producto actualizado exitosamente:', response);
        this.cargarProductos(); // Refresca la lista de productos
        this.cancelarFormulario(); // Cierra el formulario
      }, error => {
        console.error('Error al editar producto:', error);
      });
    }
  }


  // Método para aplicar los filtros
  aplicarFiltros() {
    this.productoService.buscarProductos(this.busqueda, this.filtroTipo, this.filtroSexo)
      .subscribe((productos: Producto[]) => {
        console.log('Productos recibidos en Angular:', productos);

        if (!Array.isArray(productos)) {
          console.error('Error: La respuesta de la API no es un array:', productos);
          return;
        }

        this.productosFiltrados = productos;

        console.log('Productos filtrados:', this.productosFiltrados);

        // 🔹 Forzar actualización en la vista
        this.cdRef.detectChanges();
      }, error => {
        console.error('Error al buscar productos:', error);
      });
  }
  // Función para buscar productos (se ejecuta al hacer clic en el botón de búsqueda)
  buscarProductos() {
    this.aplicarFiltros();
  }

  restablecerFiltros() {
    this.busqueda = '';
    this.filtroTipo = '';
    this.filtroSexo = '';

    // Recargar la lista de productos
    this.cargarProductos();
  }


  agregarColor() {
    if (this.nuevoColor.trim() !== '') {
      this.productoService.crearColor({ descripcion: this.nuevoColor }).subscribe(() => {
        console.log('Color agregado:', this.nuevoColor);
        this.nuevoColor = ''; // Limpiar el campo después de agregarlo
      });
    }
  }

  agregarTalla() {
    if (this.nuevaTalla.trim() !== '') {
      this.productoService.crearTalla({descripcion: this.nuevaTalla}).subscribe(() => {
        console.log('Talla agregada:', this.nuevaTalla);
        this.nuevaTalla = ''; // Limpiar el campo después de agregarlo
      });
    }



  }
  cancelarFormularioTalla() {
    this.mostrarFormularioTalla = false;
    this.nuevaTalla = '';
  }
  cancelarFormularioColor() {
    this.mostrarFormularioColor = false;
    this.nuevoColor = '';
  }
  guardarTalla() {
    if (this.nuevaTalla.trim() !== '') {
      this.productoService.crearTalla({descripcion: this.nuevaTalla}).subscribe(() => {
        console.log('Talla agregada:', this.nuevaTalla);
        this.nuevaTalla = ''; // Limpiar el campo después de agregarlo
        this.cargarProductos();
      });
    }
  }
  guardarColor() {
    if (this.nuevoColor.trim() !== '') {
      this.productoService.crearColor({descripcion: this.nuevoColor}).subscribe(() => {
        console.log('Color agregado:', this.nuevoColor);
        this.nuevoColor = ''; // Limpiar el campo después de agregarlo
        this.cargarProductos();
      });
    }
  }

}
