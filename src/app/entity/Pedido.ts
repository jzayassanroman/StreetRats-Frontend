import { Productos } from './Productos';
import { Cliente } from './Cliente';
import { Estado } from './Estado'; // Enum para el estado

export interface Pedido {
  id?: number; // Opcional, generado por el backend
  total: number;
  estado: Estado; // Enum para el estado
  fecha: Date; // Fecha en formato `Date`
  idProducto: Productos; // Relación con el modelo Productos
  idCliente: Cliente; // Relación con el modelo Cliente
}
