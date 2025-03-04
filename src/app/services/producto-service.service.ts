import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {CrearProducto, Producto} from '../Modelos/producto';
import {environment} from '../../enviroments/enviroments';


@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {
  private baseUrl = environment.baseURL;


  private apiUrl = '/api/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl+'/productos/all');
  }

  crearProducto(producto: CrearProducto): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/productos/crear', producto);
  }

  // 🔹 Agregar estos métodos si no están en tu servicio
  getTallas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+'/tallas/all');
  }


  getColores(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+`/color/all`);
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl+`/productos/sexos`);
  }
  getTipos(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl+'/productos/tipos');
  }
  // Método para eliminar un producto
  eliminarProducto(id: number): Observable<void> {
    const url = this.baseUrl+`/productos/eliminar/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al eliminar el producto:', error);
        return throwError(error);
      })
    );
  }

  editarProducto(producto: {
    id?: number;
    nombre: string;
    descripcion: string;
    tipo: string;
    precio: number;
    imagen: string;
    sexo: string;
    color: number;
    talla: number
  }) {
    console.log('ID del producto a editar:', producto.id);
    return this.http.put(this.baseUrl+`/productos/editar/${producto.id}`+"?XDEBUG_SESSION_START=11833", producto);
  }
  // Método para realizar búsqueda con filtros
  buscarProductos(busqueda: string, filtroTipo: string, filtroSexo: string): Observable<Producto[]> {
    const params = {
      nombre: busqueda || '',  // ✅ Corregido
      tipo: filtroTipo || '',  // ✅ Corregido
      sexo: filtroSexo || '' ,  // ✅ Corregido
      XDEBUG_SESSION_START :15597

    };

    console.log('Parámetros enviados a la API:', params);

    return this.http.get<Producto[]>(this.baseUrl+'/productos/buscar', { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al buscar productos:', error);
        return throwError(error);
      })
    );
  }
  // Método para crear una nueva talla
  crearColor(color: { descripcion: string }): Observable<any> {
    return this.http.post(this.baseUrl+'/color/crear', color);
  }

  crearTalla(talla: { descripcion: string }): Observable<any> {
    return this.http.post(this.baseUrl+'/tallas/crear', talla);
  }



}
