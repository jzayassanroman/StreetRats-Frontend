// cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = 'http://localhost:8000/clientes/crear';

  constructor(private http: HttpClient) {}

  crearCliente(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

}
