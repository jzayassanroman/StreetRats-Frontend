import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import {environment} from '../../enviroments/enviroments';

enum Rol {
  ADMIN = 'admin',
  USER = 'user'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseURL;
  private jwtHelper = new JwtHelperService();
  private apiUrl = '/api/api/login_check';
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable para el navbar
  constructor(private router: Router) {}

  http = inject(HttpClient);

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl , { username, password }).pipe(
      tap(response => {
        console.log('Response:', response);

        if (response.token) {
          this.handleAuthentication(response.token)


        } else {
          console.error('No se recibió un token válido.');
        }
      })
    );
  }

  handleAuthentication(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true); // ✅ Notifica cambio de estado

    const decodedToken: any = jwtDecode(token);
    console.log('Token decodificado:', decodedToken);

    const userRol = decodedToken.rol;
    if (userRol) {
      localStorage.setItem('roles', userRol);
    }
  }

  getRoles(): string[] {
    const decodedToken = this.decodeToken();
    console.log("Token222:", decodedToken);
    if(decodedToken && decodedToken.roles){
      console.log("Roles:", decodedToken.roles);
      return decodedToken.roles;
    }
    return [];
  }

  decodeToken(): any {
    const token = this.getToken();
    if(!token) return null;
    try {
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);
      return decoded;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  getToken() {
    const currentUser = localStorage.getItem('token');
    console.log("Token444:", currentUser);
    return currentUser;
  }

  isAdmin(): boolean {
    return this.getRoles().includes(Rol.ADMIN);
  }

  isUser(): boolean {
    return this.getRoles().includes(Rol.USER);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserId(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.id : null; // Asumiendo que el id está en el payload
  }

  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
  }


  getClienteId(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.id_cliente : null; // Asegúrate de usar "id_cliente"
  }


}
