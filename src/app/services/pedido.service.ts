import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = '/api/pedidos/crear'; // Ajusta la URL según tu backend Symfony

  constructor(private http: HttpClient) {}

  guardarPedido(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl, pedido);
  }
}
