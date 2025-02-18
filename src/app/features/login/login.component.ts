import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';


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
        console.log('Login exitoso - respuesta completa:', response);

        localStorage.setItem('token', response.token);

        // ✅ Extraemos el rol desde el token decodificado
        const decoded: any = jwtDecode(response.token);
        console.log("Token decodificado:", decoded);

        const userRol = decoded.rol || 'Usuario sin rol'; // Intentamos obtener el rol desde el token
        localStorage.setItem('rol', userRol);

        console.log('Rol guardado en localStorage:', userRol);

        Swal.fire({
          title: '¡Inicio de Sesión Correcto!',
          text: 'Te redirigimos a StreetRats',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['']).then(() => {
            window.location.reload(); // Recarga la página para actualizar el navbar
          });
        });
      },
      error: (error) => {
        console.error('Error en el login:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Error en el inicio de sesión',
          icon: 'error'
        });
      }
    });
  }



  navitageToRegistro(){
    this.router.navigate(['/crear-cuenta']);
  }
}
