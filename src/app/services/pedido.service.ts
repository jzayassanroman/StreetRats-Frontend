import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = '/api/pedidos';

  constructor(private http: HttpClient) {}

  guardarPedido(pedido: any): Observable<any> {
    return this.http.post(this.apiUrl+'/crear', pedido);
  }
  getPedidos(clienteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${clienteId}`);
  }
}
