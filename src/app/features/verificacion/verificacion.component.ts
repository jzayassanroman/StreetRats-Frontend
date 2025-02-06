import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { VerificacionService } from '../../services/verificacion.service';
import { CommonModule } from '@angular/common';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css'],
  providers: [VerificacionService],
})
export class VerificacionComponent {
  verificacionForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private router: Router,private fb: FormBuilder, private verificacionService: VerificacionService) {
    this.verificacionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      codigo: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.verificacionForm.valid) {
      const { email, codigo } = this.verificacionForm.value;
      this.verificacionService.verificarCodigo(email, codigo).subscribe({
        next: (response) => {
          Swal.fire({
            title: '¡Cuenta verificada con éxito!',
            text: 'Tu cuenta ha sido verificada correctamente.',
            icon: 'success',
            confirmButtonText: 'Ir a Inicio',
            timer: 3000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['']);
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al verificar cuenta:', err);
          Swal.fire({
            title: 'Error al completar la verificación',
            text: err.error?.error || 'Ha ocurrido un error inesperado.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      });
    }
  }
}
