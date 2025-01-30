import { Productos } from './Productos';
import { Pedido } from './pedido';
import { Colores } from './Colores';
import { Tallas } from './tallas';

export interface PedidoProducto {
  id?: number; // Opcional, generado por el backend
  idProducto: Productos; // Relación con el modelo Productos
  idPedido: Pedido; // Relación con el modelo Pedido
  idColor: Colores; // Relación con el modelo Colores
  idTallas: Tallas; // Relación con el modelo Tallas
}
