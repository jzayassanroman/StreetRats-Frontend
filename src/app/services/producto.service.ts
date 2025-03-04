import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {environment} from '../../enviroments/enviroments';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: number;
  imagenes: string[];
  sexo: string;
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
  private baseUrl = environment.baseURL;

  private apiUrl = '/api/productos';
  productos: Producto[] = [];

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/all`);
  }

  getProductosData(): void {
    this.getProductos().subscribe((data) => {
      console.log(data); // Verifica si 'imagenes' existe en cada objeto de producto
      this.productos = data;
    });
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/productos/find/${id}`);
  }
  getProductosPorTipo(tipo: TipoProducto): Observable<Producto[]> {
    if (!tipo) {
      console.error('Error: El tipo de producto es nulo');
      return of([]);
    }

    return this.http.get<Producto[]>(`${this.baseUrl}/productos/tipos1?tipo=${tipo.toLowerCase()}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener productos por tipo:', error);
          return of([]); // Devuelve una lista vacía en caso de error
        })
      );
  }

  buscarProductos(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/productos/buscador?nombre=${nombre}`).pipe(
      map((productos) => {
        return productos.map((producto) => ({
          ...producto,
          imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : (producto.imagenes ? [producto.imagenes] : [])
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

    return this.http.get<Producto[]>(`${this.baseUrl}/productos/filtros`, { params });
  }
  filtros(sexo?: string, talla?: string, precioMin?: number, precioMax?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (sexo) params = params.set('sexo', sexo);
    if (talla) params = params.set('talla', talla);
    if (precioMin !== undefined) params = params.set('precioMin', precioMin.toString());
    if (precioMax !== undefined) params = params.set('precioMax', precioMax.toString());

    return this.http.get<Producto[]>(`${this.baseUrl}/productos/filtrosshop`, { params });
  }






  // Método para obtener productos desde la API
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl+'/productos');
  }

  // 🔹 Agregar estos métodos si no están en tu servicio
  getTallas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+'/tallas/all');
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/productos/sexos`);
  }
  //
  // }
  getPrecios(): Observable<{ precioMin: number; precioMax: number }> {
    return this.http.get<{ precioMin: number; precioMax: number }>(`${this.baseUrl}/productos/precios-min-max`);
  }



  // Supongamos que tienes una lista de tipos de productos disponibles en tu backend
  // o puedes usar el enum directamente si ya está fijo.
  getTiposDeProductos(): Observable<TipoProducto[]> {
    return of([TipoProducto.CAMISETA, TipoProducto.SUDADERA, TipoProducto.PANTALONES, TipoProducto.ZAPATOS, TipoProducto.ACCESORIOS,TipoProducto.CAMISA]); // Aquí devuelves los tipos.
  }

}
