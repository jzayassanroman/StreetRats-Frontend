export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: number;
  imagen: string;
  sexo: string;
  id_color: {
    id: number;
    descripcion: string
  };
  id_talla: {
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
  id_color: number;
  id_talla: number;
}
