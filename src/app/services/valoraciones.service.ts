import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {
  private apiUrl = '/api/valoraciones';

  constructor(private http: HttpClient) {}

  obtenerValoraciones(idProducto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idProducto}`);
  }

  enviarValoracion(valoracionData: any, token: string | null) {
    return this.http.post(`${this.apiUrl}/nueva`, valoracionData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
