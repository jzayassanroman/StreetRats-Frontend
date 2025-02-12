import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/api/login_check';

  http = inject(HttpClient);

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password });
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verifica si hay un token en localStorage
  }
  logout() {
    localStorage.removeItem('token'); // Borra el token
  }
}
