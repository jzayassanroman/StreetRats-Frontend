import { Productos } from './Productos';
import { Cliente } from './Cliente';

export interface Valoraciones {
  id?: number; // Opcional, generado por el backend
  opinion: string; // Opinión del cliente
  fecha: Date; // Fecha de la valoración
  idProducto: Productos; // Relación con el modelo Productos
  idCliente: Cliente; // Relación con el modelo Cliente
}
