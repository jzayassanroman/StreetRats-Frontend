import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import {jwtDecode} from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';


enum Rol {
  ADMIN = 'admin',
  USER = 'user'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private apiUrl = '/api/api/login_check';

  http = inject(HttpClient);

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        console.log('Response:', response);

        if (response.token) {
          localStorage.setItem('token', response.token);

          const decodedToken: any = jwtDecode(response.token);
          console.log('Token decodificado:', decodedToken); // ✅ Verifica si el `id` está


          if (response.user?.rol) {
            localStorage.setItem('roles', response.user.rol);
          }
        } else {
          console.error('No se recibió un token válido.');
        }
      })
    );

  }


  getRoles(): string[] {
    const decodedToken = this.decodetoken();
    console.log("Token222:", decodedToken);
    //console.log("Roles333:", decodedToken.roles);
    if(decodedToken && decodedToken.roles){
      console.log("Roles:", decodedToken.roles);
      return decodedToken.roles;
    }
    return [];
  }

  decodetoken():any{
    const token = this.getToken();
    if(!token) return null;
    try{
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);
      return decoded;
    }catch (error){
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }



  getToken() {
    const currentUser = localStorage.getItem('token');
    console.log("Token444:", currentUser);
    return currentUser;// ? JSON.parse(currentUser).token : null;
  }

  // Método para verificar si el usuario es Admin
  isAdmin(): boolean {
    return this.getRoles().includes(Rol.ADMIN);
  }

  isUser(): boolean {
    return this.getRoles().includes(Rol.USER);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verifica si hay un token en localStorage
  }

  logout() {
    localStorage.clear()
  }

  getUser() {
    return this.http.get<{ id: number }>('http://localhost:8000/usuarios/api/user'); // La API debe devolver el usuario con su ID
  }
}

