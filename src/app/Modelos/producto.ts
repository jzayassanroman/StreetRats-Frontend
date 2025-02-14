export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: number;
  imagen?: string;
  imagenes?: string[]; // Añadir este campo
  sexo: string;
  color: { id: number; descripcion: string };
  talla: { id: number; descripcion: string };
}

export interface CrearProducto {
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: number;
  imagen: string;
  sexo: string;
  color: number;
  talla: number;
}
