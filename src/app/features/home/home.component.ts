import {ChangeDetectorRef, Component} from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
import {NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import {ProductosComponent} from '../productos/productos.component';
import {Producto, ProductService, TipoProducto} from '../../services/producto.service';
import {Router, RouterLink} from '@angular/router';
import {BusquedaService} from '../../services/busqueda.service';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    NgStyle,
    NgClass,
    NgFor,
    NgIf,
    NgStyle,
    ProductosComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  images = [
    'assets/home1.png',
    'assets/home2.png',
    'assets/home3.png',
  ];

  currentIndex = 1; // Iniciamos en 1 para evitar ver la imagen duplicada del inicio
  autoSlideInterval: any;
  smoothTransition = true;
  productos: any[] = [];
  productosFiltrados: Producto[] = [];
  tipoProductoEnum = TipoProducto;
  productoIndices: { [key: number]: number } = {};
  showError: boolean = false;
  searchAttempted: boolean = false; // Variable para indicar si se ha intentado buscar
  currentIndexes: { [key: number]: number } = {}; // Índices para las imágenes

  constructor(private productoService: ProductService,private router: Router, private cdr: ChangeDetectorRef,private busquedaService: BusquedaService) {
    this.startAutoSlide();
  }
  ngOnInit() {
    // Vaciar searchTerm para evitar búsquedas anteriores
    this.busquedaService.setSearchTerm('');
    this.busquedaService.searchTerm$
      .pipe(
        debounceTime(300), // Espera 300ms antes de ejecutar la búsqueda
        distinctUntilChanged() // Evita búsquedas duplicadas
      )
      .subscribe((nombre) => {
        console.log("📩 Evento recibido en HomeComponent:", nombre);
        this.cargarProductos(nombre); // Llamar solo esta función
      });
    this.productos.forEach(producto => {
      this.productoIndices[producto.id] = 0;  // Inicializa en la primera imagen
      this.currentIndexes[producto.id] = 0;
    });
  }

  cargarProductos(nombre: string) {
    this.searchAttempted = true; // Marcar que se ha realizado una búsqueda

    if (!nombre.trim()) {
      this.productos = []; // Limpiar productos si la búsqueda está vacía
      this.searchAttempted = false; // Restablecer el intento de búsqueda
      return;
    }

    console.log("🟠 Buscando productos para:", nombre);

    this.productoService.buscarProductos(nombre).subscribe({
      next: (productos) => {
        console.log("✅ Productos asignados:", productos);
        this.productos = productos;
        this.cdr.detectChanges(); // Forzar actualización de la vista

        // Desplazar la vista al primer producto encontrado
        if (productos.length > 0) {
          const firstProductElement = document.getElementById('producto-' + productos[0].id);
          if (firstProductElement) {
            firstProductElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
      error: (error) => console.error("❌ Error cargando productos:", error)
    });
  }


  buscarProductos(nombre: string): void {
    this.productos = [];  // 🔹 Limpiar antes de asignar nuevos datos
    this.productoService.buscarProductos(nombre).subscribe(
      (data) => {
        console.log("🟢 Productos obtenidos:", data);
        this.productos = data;
      },
      (error) => {
        console.error("❌ Error al buscar productos:", error);
      }
    );
  }
  prevSlideProducto(productoId: number) {
    const producto = this.getProductoById(productoId);
    if (!producto || !producto.imagenes || producto.imagenes.length === 0) return; // Verifica que el producto existe

    if (this.currentIndexes[productoId] === undefined) {
      this.currentIndexes[productoId] = 0;
    }

    if (this.currentIndexes[productoId] > 0) {
      this.currentIndexes[productoId]--;
    } else {
      this.currentIndexes[productoId] = producto.imagenes.length - 1;
    }
  }

  nextSlideProducto(productoId: number) {
    const producto = this.getProductoById(productoId);
    if (!producto || !producto.imagenes || producto.imagenes.length === 0) return; // Verifica que el producto existe

    if (this.currentIndexes[productoId] === undefined) {
      this.currentIndexes[productoId] = 0;
    }

    if (this.currentIndexes[productoId] < producto.imagenes.length - 1) {
      this.currentIndexes[productoId]++;
    } else {
      this.currentIndexes[productoId] = 0;
    }
  }


  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }


  // Filtra los productos según el tipo seleccionado
  filtrarPorCategoria(tipo: TipoProducto): void {
    this.productoService.getProductosPorTipo(tipo).subscribe(
      (productos) => {
        this.productosFiltrados = productos;
        console.log('Productos filtrados:', this.productosFiltrados);  // Verifica que los productos estén llegando correctamente
        this.router.navigate(['/productos-filtrados'], { queryParams: { tipo: tipo } });

      },
      (error) => console.error('Error al obtener productos:', error)
    );
  }

  getProductoById(productoId: number): Producto | null {
    return this.productos.find(producto => producto.id === productoId) || null;
  }


  protected readonly TipoProducto = TipoProducto;


  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  prevSlide() {
    this.smoothTransition = true;
    this.currentIndex--;

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.smoothTransition = false;
        this.currentIndex = this.images.length;
      }, 700);
    }
  }

  nextSlide() {
    this.smoothTransition = true;
    this.currentIndex++;

    if (this.currentIndex === this.images.length + 1) {
      setTimeout(() => {
        this.smoothTransition = false;
        this.currentIndex = 1;
      }, 700);
    }
  }


}



