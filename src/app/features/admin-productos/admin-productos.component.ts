import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ProductoServiceService} from '../../services/producto-service.service';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {Producto} from '../../Modelos/producto';
import { Location } from '@angular/common';


@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-productos.component.html',
  standalone: true,
  styleUrl: './admin-productos.component.css',
  providers: [ProductoServiceService]
})

export class AdminProductosComponent implements OnInit {
  tipos: string[] = [];
  mostrarFormulario: boolean = false;
  mostrarFormularioTalla: boolean = false;
  mostrarFormularioColor: boolean = false;
  productos: Producto[] = [];
  imagenes: string[] = []; // Array para las imágenes
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


  constructor(private productoService: ProductoServiceService, private fb: FormBuilder,private cdRef: ChangeDetectorRef, private location: Location) {
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
      tipos: this.productoService.getTipos(),
      productos: this.productoService.getProductos()
    }).subscribe(({ tallas, colores, sexos, tipos, productos }) => {
      console.log("Productos recibidos:", productos);
      this.talla = tallas;
      this.color = colores;
      this.sexos = sexos;
      this.tipos = tipos;
      this.productos = productos.map(producto => ({
        ...producto,
        descripcion: producto.descripcion || 'Sin descripción',
        imagenes: producto.imagenes || [] // Asegúrate de que imagenes es un array
      }));
      this.productosFiltrados = [...this.productos];

      console.log('Productos final:', this.productosFiltrados);

      this.cdRef.detectChanges(); // 🔹 Forzar actualización en la vista
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

        this.productosFiltrados = productos.map(producto => ({
          ...producto,
          imagenes: producto.imagen ? JSON.parse(producto.imagen) : [] // 🔹 Convierte el string en array
        }));

        console.log('Productos filtrados:', this.productosFiltrados);
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
  prevSlide(carouselId: number) {
    const carousel = document.getElementById(`carouselAdmin${carouselId}`);
    if (carousel) {
      const items = carousel.getElementsByClassName('carousel-item');
      const activeItem = carousel.querySelector('.carousel-item.active');
      if (items && activeItem) {
        let newIndex = Array.from(items).indexOf(activeItem) - 1;
        if (newIndex < 0) newIndex = items.length - 1;
        this.setActiveSlide(items, newIndex);
      }
    }
  }

  nextSlide(carouselId: number) {
    const carousel = document.getElementById(`carouselAdmin${carouselId}`);
    if (carousel) {
      const items = carousel.getElementsByClassName('carousel-item');
      const activeItem = carousel.querySelector('.carousel-item.active');
      if (items && activeItem) {
        let newIndex = Array.from(items).indexOf(activeItem) + 1;
        if (newIndex >= items.length) newIndex = 0;
        this.setActiveSlide(items, newIndex);
      }
    }
  }



  setActiveSlide(items: HTMLCollectionOf<Element>, newIndex: number) {
    Array.from(items).forEach((item, index) => {
      item.classList.toggle('active', index === newIndex);
    });
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
  volverAtras() {
    this.location.back();
  }

}
