import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Usuario} from '../interfaces/UsuarioDTO';
import {environment} from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = environment.baseURL;

  private apiUrl = '/api/usuarios/api/registro';

  constructor(private http: HttpClient) {}

  crearUsuario(usuarioData: Usuario): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuarioData);
  }
}
