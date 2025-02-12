import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerificacionService {
  private apiUrl = '/api/clientes/clientes/verificar-codigo';

  constructor(private http: HttpClient) {}

  verificarCodigo(email: string, codigo: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, codigo });
  }
}
