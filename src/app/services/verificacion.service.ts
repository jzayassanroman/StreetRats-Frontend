import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class VerificacionService {
  private baseUrl = environment.baseURL;

  private apiUrl = '/api/clientes/clientes/verificar-codigo';

  constructor(private http: HttpClient) {}

  verificarCodigo(email: string, codigo: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/clientes/clientes/verificar-codigo', { email, codigo });
  }
}
