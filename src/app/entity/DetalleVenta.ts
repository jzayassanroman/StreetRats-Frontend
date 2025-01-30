import { Pedido } from './pedido';
import { Productos } from './productos';

export interface DetalleVenta {
  id?: number; // ID opcional porque suele ser generado por el backend
  cantidad: number;
  subtotal: number;
  idPedido: Pedido; // Relación con el modelo Pedido
  idProducto: Productos; // Relación con el modelo Productos
}
