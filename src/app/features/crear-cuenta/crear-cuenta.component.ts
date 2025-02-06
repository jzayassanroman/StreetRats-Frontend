import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  standalone: true,
  styleUrls: ['./crear-cuenta.component.css'],
  providers: [ClienteService, UsuarioService],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
})
export class CrearCuentaComponent {


  usuarioForm: FormGroup;
  clienteForm: FormGroup;
  step = 1;
  userId: string | null = null;



  constructor(private router:Router,private fb: FormBuilder, private clienteService: ClienteService, private usuarioService: UsuarioService) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Ensure email validation
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  onSubmitUsuario(): void {
    if (this.usuarioForm.valid) {
      this.usuarioService.crearUsuario(this.usuarioForm.value).subscribe({
        next: (response: any) => {
          console.log('Usuario creado:', response);
          this.userId = response.id; // Guardar el ID del usuario
          this.step = 2;

          Swal.fire({
            title: '¡Usuario creado!',
            text: 'Tu cuenta ha sido creada con éxito. Ahora completa tu información personal.',
            icon: 'success',
            confirmButtonText: 'Continuar',
            timer: 3000,
            timerProgressBar: true
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear usuario:', err);
          Swal.fire({
            title: 'Error al crear usuario',
            text: err.error?.error || 'Ha ocurrido un error inesperado.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
    } else {
      console.log('Formulario de usuario inválido');
    }
  }


  onSubmitCliente(): void {
    if (this.clienteForm.valid && this.userId) {
      const clienteData = {
        ...this.clienteForm.value,
        id_usuario: this.userId
      };

      this.clienteService.crearCliente(clienteData).subscribe({
        next: (response: any) => {
          console.log('Cliente creado:', response);

          Swal.fire({
            title: '¡Cuenta completada!',
            text: 'Tu cuenta ha sido creada correctamente.',
            icon: 'success',
            confirmButtonText: 'Ir a verificar',
            timer: 3000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/verificar']);
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear cliente:', err);
          Swal.fire({
            title: 'Error al completar el registro',
            text: err.error?.error || 'Ha ocurrido un error inesperado.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
    } else {
      console.log('Formulario de cliente inválido o falta el ID de usuario');
    }
  }



}
