export interface Transferencia {
  id: number;
  fecha: string;
  operador: string;
  cliente: string;
  importe: number;
  estado: 'Pendiente' | 'Completado';
  comprobante: string;
}
