import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  imports: [FormsModule, HttpClientModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  carrito: any[] = [];
  total: number = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      pais: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: ['', Validators.required],
      apartamento: [''],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      paymentMethod: ['tarjeta', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fechaCaducidad: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      titular: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = parseFloat(this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2));
  }

  changePaymentMethod() {
    const selectedMethod = this.paymentForm.get('paymentMethod')?.value;

    if (selectedMethod === 'tarjeta') {
      this.paymentForm.get('numeroTarjeta')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('fechaCaducidad')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
      this.paymentForm.get('titular')?.setValidators([Validators.required]);

      this.paymentForm.get('email')?.clearValidators();
      this.paymentForm.get('password')?.clearValidators();
      this.paymentForm.patchValue({ email: '', password: '' });

    } else {
      this.paymentForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.paymentForm.get('password')?.setValidators([Validators.required]);

      this.paymentForm.get('numeroTarjeta')?.clearValidators();
      this.paymentForm.get('fechaCaducidad')?.clearValidators();
      this.paymentForm.get('cvv')?.clearValidators();
      this.paymentForm.get('titular')?.clearValidators();
      this.paymentForm.patchValue({
        numeroTarjeta: '',
        fechaCaducidad: '',
        cvv: '',
        titular: ''
      });
    }

    // 🔥 IMPORTANTE: Actualiza los validadores
    ['numeroTarjeta', 'fechaCaducidad', 'cvv', 'titular', 'email', 'password'].forEach(field => {
      this.paymentForm.get(field)?.updateValueAndValidity();
    });

    this.paymentForm.markAsPristine(); // Evita que se marquen errores antes de tocar los campos
    this.paymentForm.patchValue({ paymentMethod: selectedMethod });
  }

  processPayment() {
    if (this.paymentForm.invalid) {
      Swal.fire({
        title: '⚠️ Campos Incompletos',
        text: 'Por favor, completa todos los campos correctamente antes de continuar.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
      return;
    }

    Swal.fire({
      title: '🎉 ¡Pago Exitoso!',
      text: `Tu pago con ${this.paymentForm.get('paymentMethod')?.value === 'tarjeta' ? 'Tarjeta de Crédito' : 'PayPal'} ha sido procesado correctamente.`,
      icon: 'success',
      confirmButtonColor: '#1a202c',
    });
  }
}
