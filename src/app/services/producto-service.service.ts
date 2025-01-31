import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrearProducto, Producto} from '../Modelos/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  private apiUrl = 'http://localhost:8001/productos/all';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crearProducto(producto: CrearProducto): Observable<any> {
    return this.http.post<any>('http://localhost:8001/productos/crear', producto);
  }

  // 🔹 Agregar estos métodos si no están en tu servicio
  getTallas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8001/tallas/all');
  }


  getColores(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8001/color/all`);
  }

  getSexos(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8001/productos/sexos`);
  }
  getTipos(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8001/productos/tipos');
  }

}
