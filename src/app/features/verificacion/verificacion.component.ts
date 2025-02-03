import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { VerificacionService } from '../../services/verificacion.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private verificacionService: VerificacionService) {
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
          this.successMessage = response.message;
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Error al verificar el código';
          this.successMessage = null;
        },
      });
    }
  }
}
