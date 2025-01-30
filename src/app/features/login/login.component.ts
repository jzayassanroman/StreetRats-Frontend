import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';


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

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token);
      },
      error: () => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
