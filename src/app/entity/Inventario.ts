import { Productos } from './productos';

export interface Inventario {
  id?: number; // Opcional ya que puede ser generado por el backend
  cantidad: number;
  idProducto: Productos; // Relación con el modelo Productos
}
