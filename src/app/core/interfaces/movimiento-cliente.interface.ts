export interface MovimientoCliente {
  Carrera: number;
  TipoMov: 'Transferencia' | 'Venta' | 'Pago' | 'Retiro' | 'Propina';
  Monto: number;
  Saldo: number;
}
