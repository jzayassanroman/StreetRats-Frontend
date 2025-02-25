import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, forkJoin, map, Observable, of, switchMap, tap, throwError} from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: TipoProducto;
  precio: number;
  imagenes: string[];
  sexo: string;
  // color: {id: number, descripcion: string},
  // talla: {id: number, descripcion: string }
  id_talla: number;
  id_color: number;
  color?: string;
}
export enum TipoProducto {
  CAMISETA = 'Camiseta',
  SUDADERA = 'Sudadera',
  PANTALONES = 'Pantalones',
  ZAPATOS = 'Zapatos',
  ACCESORIOS = 'Accesorios',
  CAMISA = 'Camisa'
}



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/productos';
  productos: Producto[] = [];

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/all`);
  }

  getProductosData(): void {
    this.getProductos().subscribe((data) => {
      console.log(data); // Verifica si 'imagenes' existe en cada objeto de producto
      this.productos = data;
    });
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/find/${id}`);
  }
  // getProductosPorTipo(tipo: TipoProducto): Observable<Producto[]> {
  //   return this.http.get<Producto[]>(`${this.apiUrl}/tipos?tipo=${tipo.toLowerCase()}`); // Convertir a minúsculas antes de enviarlo
  // }
  getProductosPorTipo(tipo: TipoProducto): Observable<Producto[]> {
    if (!tipo) {
      console.error('Error: El tipo de producto es nulo');
      return of([]);
    }

    return this.http.get<Producto[]>(`${this.apiUrl}/tipos?tipo=${tipo.toLowerCase()}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener productos por tipo:', error);
          return of([]); // Devuelve una lista vacía en caso de error
        })
      );
  }

  buscarProductos(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar?nombre=${nombre}`).pipe(
      map((productos) => {
        return productos.map((producto) => ({
          ...producto,
          imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : [producto.imagenes]
        }));
      }),
      tap((productos) => {
        console.log("Productos recibidos desde el backend:", productos);
      })
    );
  }
  filtrarProductos(tipo ?:string,sexo?: string, talla?: string, precioMin?: number, precioMax?: number): Observable<Producto[]> {
    let params = new HttpParams();
    // @ts-ignore
    params = params.set('tipo', localStorage.getItem('tipo'));
    console.log(localStorage.getItem('tipo'));
    if (sexo) params = params.set('sexo', sexo);
    if (talla) params = params.set('talla', talla);
    if (precioMin) params = params.set('precioMin', precioMin.toString());
    if (precioMax) params = params.set('precioMax', precioMax.toString());

    return this.http.get<Producto[]>(`${this.apiUrl}/filtros`, { params });
  }


  // Método para obtener productos desde la API
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>('/api/productos');
  }

  // 🔹 Agregar estos métodos si no están en tu servicio
  getTallas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8001/tallas/all');
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sexos`);
  }
  //
  // }
  getPrecios(): Observable<{ precioMin: number; precioMax: number }> {
    return this.http.get<{ precioMin: number; precioMax: number }>(`${this.apiUrl}/precios-min-max`);
  }



  // Supongamos que tienes una lista de tipos de productos disponibles en tu backend
  // o puedes usar el enum directamente si ya está fijo.
  getTiposDeProductos(): Observable<TipoProducto[]> {
    return of([TipoProducto.CAMISETA, TipoProducto.SUDADERA, TipoProducto.PANTALONES, TipoProducto.ZAPATOS, TipoProducto.ACCESORIOS,TipoProducto.CAMISA]); // Aquí devuelves los tipos.
  }

}
