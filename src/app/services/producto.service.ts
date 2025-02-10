import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/productos';
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
}
