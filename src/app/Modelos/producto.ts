export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: number;
  imagen: string;
  sexo: string;
  color: {
    id: number;
    descripcion: string
  };
  talla: {
    id: number;
    descripcion: string
  };
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
