import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ProductoServiceService} from '../../services/producto-service.service';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {forkJoin} from 'rxjs';
import {Producto} from '../../Modelos/producto';
import { Location } from '@angular/common';
import {PreloaderComponent} from '../preloader/preloader.component';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, PreloaderComponent],
  templateUrl: './admin-productos.component.html',
  standalone: true,
  styleUrl: './admin-productos.component.css',
  providers: [ProductoServiceService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminProductosComponent implements OnInit {
  cargando: boolean = true; // Nueva propiedad para controlar el estado de carga

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

  constructor(private productoService: ProductoServiceService, private fb: FormBuilder, private cdRef: ChangeDetectorRef, private location: Location) {
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
    this.cargando = true;
    this.cdRef.detectChanges();  // 🔹 Forzar actualización inmediata

    forkJoin({
      tallas: this.productoService.getTallas(),
      colores: this.productoService.getColores(),
      sexos: this.productoService.getSexos(),
      tipos: this.productoService.getTipos(),
      productos: this.productoService.getProductos()
    }).subscribe(({ tallas, colores, sexos, tipos, productos }) => {
      this.talla = tallas;
      this.color = colores;
      this.sexos = sexos;
      this.tipos = tipos;
      this.productos = productos.map(producto => ({
        ...producto,
        descripcion: producto.descripcion || 'Sin descripción',
        imagenes: producto.imagenes || []
      }));
      this.productosFiltrados = [...this.productos];

      setTimeout(() => {
        this.cargando = false;
        this.cdRef.detectChanges(); // 🔹 Forzar actualización en la vista
      }, 500); // Agregar un pequeño retraso para permitir la visualización del preloader
    }, error => {
      console.error("Error cargando productos:", error);
      this.cargando = false;
      this.cdRef.detectChanges();
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
    this.productoSeleccionado = { ...producto }; // Clone the selected product
    this.mostrarFormulario = true;

    // Concatenate the image URLs into a single string separated by commas
    const imagenesConcatenadas = producto.imagenes ? producto.imagenes.join(',') : '';

    // Load the properties correctly into the form
    this.productoForm.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      tipo: producto.tipo,
      precio: producto.precio,
      imagen: imagenesConcatenadas, // Assign the concatenated string of image URLs
      sexo: producto.sexo,
      talla: producto.talla?.id, // Assign only the ID of the size
      color: producto.color?.id  // Assign only the ID of the color
    });

    // Ensure the images are assigned correctly
    this.productoSeleccionado.imagenes = producto.imagenes ? producto.imagenes : [];

    console.log('Producto cargado en el formulario:', this.productoForm.value);
    console.log('Imágenes del producto:', this.productoSeleccionado.imagenes);
  }

  guardarCambios() {
    if (this.productoSeleccionado) {
      const productoEditado = {
        ...this.productoForm.value, // Obtener los valores del formulario
        talla: this.productoForm.value.talla ? Number(this.productoForm.value.talla) : null,
        color: this.productoForm.value.color ? Number(this.productoForm.value.color) : null,
        imagen: this.productoForm.value.imagen.split(',') // Convertir la cadena de URLs a un array
      };

      console.log('Producto editado antes de enviar:', productoEditado);

      this.productoService.editarProducto(productoEditado).subscribe(response => {
        console.log('Producto actualizado exitosamente:', response);
        this.cargarProductos(); // Refrescar la lista de productos
        this.cancelarFormulario(); // Cerrar el formulario
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

        this.productosFiltrados = productos.map(producto => {
          let imagenes: string[] = [];
          if (typeof producto.imagen === 'string') {
            try {
              // Try to parse the imagen field as JSON
              imagenes = JSON.parse(producto.imagen);
              if (!Array.isArray(imagenes)) {
                // If it's not an array, wrap it in an array
                imagenes = [producto.imagen];
              }
            } catch (e) {
              // If parsing fails, assume it's a single URL string
              imagenes = [producto.imagen];
            }
          }
          return {
            ...producto,
            imagenes: imagenes.filter((img): img is string => !!img) // Ensure imagenes is an array of strings
          };
        });

        console.log('Productos filtrados:', this.productosFiltrados);
        this.cdRef.detectChanges(); // Forzar la detección de cambios
      }, error => {
        console.error('Error al aplicar filtros:', error);
      });
  }

  // Función para buscar productos (se ejecuta al hacer clic en el botón de búsqueda)
  buscarProductos() {
    console.log('Realizando búsqueda con:', this.busqueda, this.filtroTipo, this.filtroSexo);
    this.productoService.buscarProductos(this.busqueda, this.filtroTipo, this.filtroSexo).subscribe(
      (productos) => {
        console.log('Productos encontrados:', productos);
        this.productosFiltrados = productos.map(producto => {
          let imagenes: string[] = [];
          if (typeof producto.imagen === 'string') {
            try {
              // Try to parse the imagen field as JSON
              imagenes = JSON.parse(producto.imagen);
              if (!Array.isArray(imagenes)) {
                // If it's not an array, wrap it in an array
                imagenes = [producto.imagen];
              }
            } catch (e) {
              // If parsing fails, assume it's a single URL string
              imagenes = [producto.imagen];
            }
          }
          return {
            ...producto,
            imagenes: imagenes.filter((img): img is string => !!img) // Ensure imagenes is an array of strings
          };
        });
        console.log('Productos con imágenes:', this.productosFiltrados);
        this.cdRef.detectChanges(); // Forzar la detección de cambios
      },
      (error) => console.error('Error al buscar productos:', error)
    );
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
