import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = environment.baseURL;

  private apiUrl = '/api/pedidos'; // Ajusta la URL según tu backend Symfony

  constructor(private http: HttpClient) {}

  guardarPedido(pedido: any): Observable<any> {
    return this.http.post(this.baseUrl+'/crear', pedido);
  }
  getPedidos(clienteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cliente/${clienteId}`);
  }

  findall():Observable<any> {
    return this.http.get(this.baseUrl+'/all');
  }
  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/eliminar/${id}`);
  }
  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/estado`, { estado });
  }

}
