export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  rut?: string;
  activo: boolean;
  estado: string;
  datosBancarios?: {
    banco: number;
    tipoCuenta: number;
    numeroCuenta: string;
  };
}
