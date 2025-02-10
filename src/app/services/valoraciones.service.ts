import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {
  private apiUrl = 'http://localhost:8000/valoraciones';

  constructor(private http: HttpClient) {}

  obtenerValoraciones(idProducto: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idProducto}`);
  }

  enviarValoracion(valoracionData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, valoracionData);
  }
}
