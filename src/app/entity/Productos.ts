import { Sexo } from './sexo';
import { Tipo } from './Tipos';
import { Tallas } from './Tallas';
import { Colores } from './Colores';

export interface Productos {
  id?: number; // Opcional, generado por el backend
  nombre: string; // Nombre del producto
  descripcion: string; // Descripción del producto
  tipo: Tipo; // Tipo del producto (enum)
  precio: number; // Precio del producto
  img: string; // URL de la imagen del producto
  sexo: Sexo; // Sexo asociado al producto (enum)
  idTalla: Tallas; // Relación con el modelo Tallas
  idColor: Colores; // Relación con el modelo Colores
}
