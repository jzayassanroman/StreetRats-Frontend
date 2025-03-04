import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {
  private baseUrl = environment.baseURL;

  private apiUrl = '/api/valoraciones';

  constructor(private http: HttpClient) {}

  obtenerValoraciones(idProducto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${idProducto}`);
  }

  enviarValoracion(valoracionData: any, token: string | null) {
    return this.http.post(`${this.baseUrl}/nueva`, valoracionData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
