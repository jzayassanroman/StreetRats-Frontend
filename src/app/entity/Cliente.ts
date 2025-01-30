export interface Cliente {
  id?: number; // Propiedad opcional
  nombre: string;
  apellido: string;
  email: string;
  telefono: number;
  direccion: string;
  idUser: User; // Referencia a la entidad User
}

type Rol = 'admin' | 'user' | 'guest'; // Example definition, adjust as needed

export interface User {
  id?: number;
  username: string; // Aquí define las propiedades que tenga User
  password: string;
  Rol: Rol; // Ajusta según el modelo original de User
  // Agrega otros campos si los tienes en el modelo User de PHP
}
