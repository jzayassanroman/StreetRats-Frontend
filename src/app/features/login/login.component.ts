import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]

})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  authService = inject(AuthService);
  constructor(private router:Router) {
  }

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token);
        this.router.navigate(['']).then(() => {
          window.location.reload(); // Recarga la página para actualizar el navbar
        });
      },
      error: () => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
  navitageToRegistro(){
    this.router.navigate(['/crear-cuenta']);
  }
}
