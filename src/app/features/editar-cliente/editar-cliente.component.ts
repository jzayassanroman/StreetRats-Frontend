import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent implements OnInit {
  cliente: any = {}; // Datos actuales del cliente
  nuevoUsername: string = ''; // Campo opcional para cambiar username

  constructor(private clienteService: ClienteService, private authService: AuthService) {}

  ngOnInit() {
    this.obtenerDatosCliente();
  }

  // ✅ Obtener los datos del cliente logueado
  obtenerDatosCliente() {
    this.clienteService.obtenerClientePorUsuario().subscribe({
      next: (cliente) => {
        this.cliente = cliente;

        // 🔹 Si el backend envía "username" dentro del objeto cliente, lo asignamos
        if (cliente.username) {
          this.nuevoUsername = cliente.username;
        } else {
          console.warn('⚠ El backend no envió el campo username');
        }
      },
      error: (err) => console.error('Error al obtener datos del cliente', err)
    });
  }



  // ✅ Guardar cambios del cliente
  onEditarCliente() {
    const clienteEditado = { ...this.cliente }; // Copia de los datos del cliente
    clienteEditado.username = this.nuevoUsername; // Agregar el username al objeto

    this.clienteService.editClienteYUsername(clienteEditado, this.nuevoUsername)
      .subscribe({
        next: (response) => {
          console.log('Cliente actualizado:', response);
          alert('Cliente actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Hubo un error al actualizar el cliente');
        }
      });
  }
}
