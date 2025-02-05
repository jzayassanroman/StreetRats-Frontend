import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {CrearProducto, Producto} from '../Modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  private apiUrl = '/api/productos/all';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crearProducto(producto: CrearProducto): Observable<any> {
    return this.http.post<any>('/api/productos/crear', producto);
  }

  // 🔹 Agregar estos métodos si no están en tu servicio
  getTallas(): Observable<any[]> {
    return this.http.get<any[]>('/api/tallas/all');
  }


  getColores(): Observable<any[]> {
    return this.http.get<any[]>(`/api/color/all`);
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`/api/productos/sexos`);
  }
  getTipos(): Observable<string[]> {
    return this.http.get<string[]>('/api/productos/tipos');
  }
  // Método para eliminar un producto
  eliminarProducto(id: number): Observable<void> {
    const url = `/api/productos/eliminar/${id}`;
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
    id_color: number;
    id_talla: number
  }) {
    console.log('ID del producto a editar:', producto.id);
    return this.http.put(`/api/productos/editar/${producto.id}`, producto);
  }

}
