import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../entity/Pedido';
import { Estado } from '../../entity/Estado'; // Import Estado
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css'],
  providers: [PedidoService],
})
export class HistorialPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  Estado = Estado; // Exponer el enum para usarlo en la plantilla HTML

  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const clienteId = this.authService.getClienteId(); // Obtener ID del cliente desde el token

    if (clienteId) {
      this.obtenerPedidos(clienteId);
    } else {
      console.error('No se pudo obtener la ID del cliente.');
    }
  }

  obtenerPedidos(clienteId: number): void {
    this.pedidoService.getPedidos(clienteId).subscribe({
      next: (data) => (this.pedidos = data),
      error: (err) => console.error('Error cargando pedidos', err),
    });
  }


}
