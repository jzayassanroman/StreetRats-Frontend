import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';

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

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private usuarioService: UsuarioService) {
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
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmitUsuario(): void {
    if (this.usuarioForm.valid) {
      this.usuarioService.crearUsuario(this.usuarioForm.value).subscribe({
        next: (response: any) => {
          console.log('Usuario creado:', response);
          this.userId = response.id; // Guardar el ID del usuario
          console.log('User ID:', this.userId); // Log the userId to ensure it is set
          this.step = 2;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear usuario:', err);
          alert(`Error: ${err.message}\nDetalles: ${err.error.error}`);
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
      }; // Include user ID, username, and password

      console.log('Cliente data:', clienteData); // Log the request payload

      this.clienteService.crearCliente(clienteData).subscribe({
        next: (response: any) => console.log('Cliente creado:', response),
        error: (err: HttpErrorResponse) => {
          console.error('Error al crear cliente:', err);
          alert(`Error: ${err.message}\nDetalles: ${err.error.error}`);
        }
      });
    } else {
      console.log('Formulario de cliente inválido o falta el ID de usuario');
    }
  }
}
