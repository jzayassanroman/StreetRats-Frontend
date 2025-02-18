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

        this.authService.handleAuthentication(response.token);

        localStorage.setItem('token', response.token);

        // ✅ Extraemos el rol desde el token decodificado
        const decoded: any = jwtDecode(response.token);
        console.log("Token decodificado:", decoded);

        const userRol = decoded.rol; // ✅ Extraer correctamente el rol
        if (userRol) {
          localStorage.setItem('roles', userRol); // ✅ Guardar correctamente el rol
        }

        console.log('Rol guardado en localStorage:', localStorage.getItem('roles'));

        if (userRol === 'Admin') {
          this.router.navigate(['/admindashboard']);
        } else {
          this.router.navigate(['/']);

        }

        Swal.fire({
          title: '¡Inicio de Sesión Correcto!',
          text: 'Te redirigimos a StreetRats',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          if (userRol === 'Admin') {
            this.router.navigate(['/admindashboard']);
          } else {
            this.router.navigate(['/']);
            location.reload();
          }
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
