// gestion-pedidos.component.ts

import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import {Location, NgClass, NgFor, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-gestion-pedidos',
  imports: [
    NgClass,
    FormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './gestion-pedidos.component.html',
  standalone: true,
  styleUrl: './gestion-pedidos.component.css'
})
export class GestionPedidosComponent implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  pedidosMostrados: any[] = [];  // Pedidos que se muestran en la página actual
  filtroEstado: string = '';
  busqueda: string = '';
  paginaActual: number = 1;
  pedidosPorPagina: number = 5;
  totalPaginas: number = 0;
  pedidoAEditar: any = null; // Pedido a editar
  nuevoEstado: string = '';  // El nuevo estado seleccionado
  private busquedaSubject = new Subject<string>();

  constructor(private pedidoService: PedidoService, private location: Location) {
    this.busquedaSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.filtrarPedidos();
    });
  }

  ngOnInit() {
    this.obtenerPedidos();
  }

  onBusquedaChange(): void {
    this.busquedaSubject.next(this.busqueda);
  }

  obtenerPedidos() {
    this.pedidoService.findall().subscribe(
      (data) => {
        this.pedidos = data;
        this.filtrarPedidos();
      },
      (error) => {
        console.error('Error al obtener pedidos:', error);
      }
    );
  }

  filtrarPedidos(): void {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      const coincideBusqueda = this.busqueda ? pedido.cliente.toLowerCase().includes(this.busqueda.toLowerCase()) : true;
      const estadoFiltrado = this.filtroEstado ? this.filtroEstado.toLowerCase().replace(' ', '_') : '';
      const estadoPedido = pedido.estado.toLowerCase().replace(' ', '_');
      const coincideEstado = estadoFiltrado ? estadoPedido === estadoFiltrado : true;
      return coincideBusqueda && coincideEstado;
    });

    this.totalPaginas = Math.ceil(this.pedidosFiltrados.length / this.pedidosPorPagina);
    this.mostrarPedidosPorPagina();
  }

  mostrarPedidosPorPagina(): void {
    const inicio = (this.paginaActual - 1) * this.pedidosPorPagina;
    const fin = inicio + this.pedidosPorPagina;
    this.pedidosMostrados = this.pedidosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(direccion: number): void {
    const nuevaPagina = this.paginaActual + direccion;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.mostrarPedidosPorPagina();
    }
  }

  // Función para editar el estado de un pedido
  actualizarEstado(pedido: any): void {
    this.pedidoService.actualizarEstado(pedido.id, pedido.estado).subscribe(
      response => {
        Swal.fire('¡Éxito!', 'Estado actualizado correctamente.', 'success');
      },
      error => {
        console.error('Error al actualizar estado', error);
        Swal.fire('Error', 'No se pudo actualizar el estado.', 'error');
      }
    );
  }


  // Guardar cambios de estado
  guardarCambios(): void {
    const cambios = this.pedidosMostrados.filter(pedido => pedido.estado !== pedido.estadoOriginal);
    cambios.forEach(pedido => {
      this.actualizarEstado(pedido);
    });
  }


  eliminarPedido(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `No podrás revertir esta acción. ¿Deseas eliminar el pedido #${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidoService.deletePedido(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El pedido ha sido eliminado correctamente.', 'success');
            this.obtenerPedidos(); // Actualiza la lista
          },
          error: (error) => {
            console.error('Error al eliminar el pedido:', error);
            Swal.fire('Error', 'No se pudo eliminar el pedido. Verifica que no tenga dependencias.', 'error');
          }
        });
      }
    });
  }
  volverAtras() {
    this.location.back();
  }
}
