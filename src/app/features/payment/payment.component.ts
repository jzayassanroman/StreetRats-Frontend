import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  imports: [FormsModule, HttpClientModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./payment.component.css'],
  providers: [PedidoService]
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  carrito: any[] = [];
  total: number = 0;
  clienteId: number | null = null; // Ahora se extrae dinámicamente del token

  constructor(private fb: FormBuilder, private pedidoService: PedidoService) {}

  ngOnInit(): void {
    // Obtener el token desde localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.clienteId = decodedToken.id_cliente; // Extraer id_cliente del token
        console.log('ID del Cliente obtenido:', this.clienteId);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.warn('No se encontró un token en localStorage.');
    }

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
      numeroTarjeta: ['', [Validators.pattern(/^\d{16}$/)]],
      fechaCaducidad: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.pattern(/^\d{3}$/)]],
      titular: [''],
      email: ['', [Validators.email]],
      password: ['']
    });

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado).map((item: any) => ({
        ...item,
        talla: item.talla || 'No especificado',
        color: item.color || 'Color predeterminado'
      }));
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

    } else { // Si elige PayPal
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

    // ✅ Actualizar validaciones y valores
    ['numeroTarjeta', 'fechaCaducidad', 'cvv', 'titular', 'email', 'password'].forEach(field => {
      this.paymentForm.get(field)?.updateValueAndValidity();
    });

    this.paymentForm.markAsPristine();
    this.paymentForm.patchValue({ paymentMethod: selectedMethod });
  }


  processPayment() {
    console.log('Formulario válido:', this.paymentForm.valid);
    console.log('Datos del formulario:', this.paymentForm.value);

    Object.keys(this.paymentForm.controls).forEach(key => {
      if (this.paymentForm.get(key)?.invalid) {
        console.log(`❌ Error en ${key}:`, this.paymentForm.get(key)?.errors);
      }
    });

    if (this.paymentForm.invalid) {
      Swal.fire({
        title: '⚠️ Campos Incompletos',
        text: 'Por favor, completa todos los campos correctamente antes de continuar.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
      return;
    }

    if (!this.clienteId) {
      Swal.fire({
        title: '❌ Error',
        text: 'No se pudo obtener el ID del cliente. Inicia sesión nuevamente.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const pedido = {
      id_cliente: this.clienteId,
      total: this.total,
      estado: 'en_curso', // ✅ Usa el mismo formato que en el backend
      fecha: new Date().toISOString().split('T')[0],
      productos: this.carrito.map(item => ({
        id_producto: item.id,
        id_color: item.colorId || null,
        id_talla: item.tallaId || null,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      }))
    };

    console.log('Pedido enviado:', pedido); // 🔥 Verificar en consola antes de enviar

    this.pedidoService.guardarPedido(pedido).subscribe({
      next: (response) => {
        Swal.fire({
          title: '🎉 ¡Pago Exitoso!',
          text: 'Tu pedido ha sido registrado correctamente.',
          icon: 'success',
          confirmButtonColor: '#1a202c',
        });

        localStorage.removeItem('carrito');
        this.carrito = [];
        this.total = 0;
      },
      error: (err) => {
        Swal.fire({
          title: '❌ Error en el pago',
          text: 'Hubo un problema al procesar el pedido.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        console.error('Error al guardar el pedido:', err);
      }
    });
  }

}
