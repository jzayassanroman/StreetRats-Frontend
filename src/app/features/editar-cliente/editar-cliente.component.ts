import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import {ClienteService} from '../../services/cliente.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent {
  // Datos del cliente que se van a editar
  cliente = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  // El nuevo username que se quiere establecer
  nuevoUsername: string = '';

  constructor(private clienteService: ClienteService, private authService: AuthService) {}

  // Método para editar el cliente y el username
  onEditarCliente() {
    // Aquí no necesitamos el clienteId explícitamente, ya que lo tomamos del token
    this.clienteService.editClienteYUsername(this.cliente, this.nuevoUsername)
      .subscribe({
        next: (response: any) => {
          console.log('Cliente y username actualizados:', response);
          alert('Cliente y username actualizados correctamente');
        },
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          alert('Hubo un error al actualizar el cliente');
        }
      });
  }
}
