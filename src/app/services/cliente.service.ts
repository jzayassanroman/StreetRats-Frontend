// cliente.service.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {environment} from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private baseUrl = environment.baseURL;

  private apiUrl = '/clientes';

  constructor(private http: HttpClient, private authService:AuthService) {}

  crearCliente(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/crear', data);
  }

  obtenerClientePorUsuario(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.baseUrl}/usuario`, { headers });
  }


  editClienteYUsername(cliente: any, nuevoUsername: string): Observable<any> {
    const userId = this.authService.getUserId(); // Obtener el ID del usuario desde el token

    if (!userId) {
      throw new Error('No se puede obtener el ID del usuario desde el token');
    }

    const body = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      username: nuevoUsername // Asegurar que el username se envía correctamente
    };

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.baseUrl}/editar`, body, { headers });
  }



}
