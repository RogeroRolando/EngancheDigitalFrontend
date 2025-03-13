import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export type EstadoTransferencia = 'Pendiente' | 'Completado' | 'Rechazado';
export type TipoActividad = 'Transferencia' | 'Registro';
export type EstadoActividad = 'Pendiente' | 'Completado';

export interface Transferencia {
  id: number;
  fecha: string;
  cliente: string;
  importe: number;
  estado: EstadoTransferencia;
  comprobante?: string;
  operador?: string;
  clienteId?: number;
}

export interface DashboardStats {
  operadoresActivos: number;
  clientesActivos: number;
  transferenciasPendientes: number;
  totalTransferido: number;
}

export interface DashboardEncargadoStats {
  operadoresActivos: number;
  clientesTotales: number;
  transferenciasPendientes: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  email?: string;
  telefono?: string;
  rut?: string;
  activo: boolean;
}

export interface Operador {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface Actividad {
  fecha: string;
  operador: string;
  cliente: string;
  tipo: TipoActividad;
  estado: EstadoActividad;
}

export interface TransferenciaStats {
  pendientes: number;
  completados: number;
  rechazados: number;
}

@Injectable({
  providedIn: 'root'
})
export class EngancheService {
  private apiUrl = 'http://localhost:3000/api'; // URL base de la API
  private transferencias: Transferencia[] = [
    {
      id: 1,
      fecha: '2025-03-13 10:30',
      cliente: 'Juan Pérez',
      clienteId: 1,
      importe: 50000,
      estado: 'Pendiente'
    },
    {
      id: 2,
      fecha: '2025-03-13 11:15',
      cliente: 'Juan Pérez',
      clienteId: 1,
      importe: 75000,
      estado: 'Completado',
      comprobante: 'assets/images/comprobante1.jpg'
    },
    {
      id: 3,
      fecha: '2025-03-12 15:45',
      cliente: 'Juan Pérez',
      clienteId: 1,
      importe: 30000,
      estado: 'Rechazado'
    },
    {
      id: 4,
      fecha: '2025-03-12 09:30',
      cliente: 'María González',
      clienteId: 2,
      importe: 100000,
      estado: 'Pendiente'
    },
    {
      id: 5,
      fecha: '2025-03-12 10:15',
      cliente: 'María González',
      clienteId: 2,
      importe: 80000,
      estado: 'Completado'
    },
    {
      id: 6,
      fecha: '2025-03-11 14:20',
      cliente: 'Carlos Rodríguez',
      clienteId: 3,
      importe: 25000,
      estado: 'Rechazado'
    },
    {
      id: 7,
      fecha: '2025-03-11 16:45',
      cliente: 'Carlos Rodríguez',
      clienteId: 3,
      importe: 80000,
      estado: 'Completado'
    },
    {
      id: 8,
      fecha: '2025-03-13 08:15',
      cliente: 'Ana Silva',
      clienteId: 4,
      importe: 45000,
      estado: 'Pendiente'
    },
    {
      id: 9,
      fecha: '2025-03-12 13:30',
      cliente: 'Ana Silva',
      clienteId: 4,
      importe: 60000,
      estado: 'Rechazado'
    },
    {
      id: 10,
      fecha: '2025-03-11 11:00',
      cliente: 'Pedro Martínez',
      clienteId: 5,
      importe: 35000,
      estado: 'Pendiente'
    },
    {
      id: 11,
      fecha: '2025-03-13 09:45',
      cliente: 'Pedro Martínez',
      clienteId: 5,
      importe: 90000,
      estado: 'Completado'
    }
  ];

  private transferenciasValidacion: Transferencia[] = [
    {
      id: 1,
      fecha: '2024-01-15',
      operador: 'Juan Pérez',
      cliente: 'Carlos Rodríguez',
      importe: 1500.00,
      estado: 'Pendiente',
      comprobante: './assets/images/comprobante1.jpg'
    },
    {
      id: 2,
      fecha: '2024-01-14',
      operador: 'María García',
      cliente: 'Ana López',
      importe: 2300.50,
      estado: 'Completado',
      comprobante: './assets/images/comprobante2.jpg'
    }
  ];

  private clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', email: 'juan@email.com', telefono: '+56912345678', activo: true },
    { id: 2, nombre: 'María González', rut: '98.765.432-1', email: 'maria@email.com', telefono: '+56923456789', activo: true },
    { id: 3, nombre: 'Carlos Rodríguez', rut: '11.222.333-4', email: 'carlos@email.com', telefono: '+56934567890', activo: true },
    { id: 4, nombre: 'Ana Silva', rut: '44.555.666-7', email: 'ana@email.com', telefono: '+56945678901', activo: true },
    { id: 5, nombre: 'Pedro Martínez', rut: '77.888.999-0', email: 'pedro@email.com', telefono: '+56956789012', activo: true }
  ];

  private operadores: Operador[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@enganche.com', activo: true },
    { id: 2, nombre: 'María López', email: 'maria@enganche.com', activo: true },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@enganche.com', activo: true },
    { id: 4, nombre: 'Ana García', email: 'ana@enganche.com', activo: false }
  ];

  private actividades: Actividad[] = [
    {
      fecha: '2025-03-13 14:30',
      operador: 'Juan Pérez',
      cliente: 'Cliente A',
      tipo: 'Transferencia',
      estado: 'Pendiente'
    },
    {
      fecha: '2025-03-13 13:15',
      operador: 'María López',
      cliente: 'Cliente B',
      tipo: 'Registro',
      estado: 'Completado'
    },
    {
      fecha: '2025-03-13 12:45',
      operador: 'Carlos Ruiz',
      cliente: 'Cliente C',
      tipo: 'Transferencia',
      estado: 'Completado'
    }
  ];

  private dashboardStats: DashboardStats = {
    operadoresActivos: 5,
    clientesActivos: 12,
    transferenciasPendientes: 4,
    totalTransferido: 25000
  };

  constructor(private http: HttpClient) { }

  // Métodos para Transferencias
  getTransferencias(): Observable<Transferencia[]> {
    return of(this.transferencias);
  }

  getTransferenciasRecientes(limite: number = 3): Observable<Transferencia[]> {
    return of(this.transferencias.slice(0, limite));
  }

  getTransferenciasPorCliente(clienteId: number): Observable<Transferencia[]> {
    return of(this.transferencias.filter(t => t.clienteId === clienteId));
  }

  getTransferenciasPorFecha(fecha: Date): Observable<Transferencia[]> {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    return of(this.transferencias.filter(t => {
      const fechaTransferencia = new Date(t.fecha);
      return fechaTransferencia >= fechaInicio && fechaTransferencia <= fechaFin;
    }));
  }

  getTransferenciasValidacion(): Observable<Transferencia[]> {
    return of(this.transferenciasValidacion);
  }

  actualizarEstadoTransferenciaValidacion(id: number, estado: EstadoTransferencia): Observable<boolean> {
    const index = this.transferenciasValidacion.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transferenciasValidacion[index].estado = estado;
      return of(true);
    }
    return of(false);
  }

  agregarTransferencia(transferencia: Omit<Transferencia, 'id'>): Observable<Transferencia> {
    const nuevaTransferencia: Transferencia = {
      ...transferencia,
      id: this.transferencias.length + 1
    };
    this.transferencias.unshift(nuevaTransferencia);
    this.actualizarEstadisticas();
    return of(nuevaTransferencia);
  }

  // Métodos para Clientes
  getClientes(): Observable<Cliente[]> {
    return of(this.clientes);
  }

  getClientesActivos(): Observable<Cliente[]> {
    return of(this.clientes.filter(cliente => cliente.activo));
  }

  // Métodos para Operadores
  getOperadores(): Observable<Operador[]> {
    return of(this.operadores);
  }

  getOperadoresActivos(): Observable<Operador[]> {
    return of(this.operadores.filter(operador => operador.activo));
  }

  // Métodos para Actividades
  getActividades(): Observable<Actividad[]> {
    return of(this.actividades);
  }

  getActividadesRecientes(limite: number = 3): Observable<Actividad[]> {
    return of(this.actividades.slice(0, limite));
  }

  // Métodos para Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return of(this.dashboardStats);
  }

  getDashboardEncargadoStats(): Observable<DashboardEncargadoStats> {
    return of({
      operadoresActivos: this.operadores.filter(op => op.activo).length,
      clientesTotales: this.clientes.length,
      transferenciasPendientes: this.transferencias.filter(t => t.estado === 'Pendiente').length
    });
  }

  getTransferenciasStats(transferencias: Transferencia[]): TransferenciaStats {
    return {
      pendientes: transferencias.filter(t => t.estado === 'Pendiente').length,
      completados: transferencias.filter(t => t.estado === 'Completado').length,
      rechazados: transferencias.filter(t => t.estado === 'Rechazado').length
    };
  }

  // Métodos privados de utilidad
  private actualizarEstadisticas(): void {
    this.dashboardStats = {
      ...this.dashboardStats,
      transferenciasPendientes: this.transferencias.filter(t => t.estado === 'Pendiente').length,
      totalTransferido: this.transferencias
        .filter(t => t.estado === 'Completado')
        .reduce((total, t) => total + t.importe, 0)
    };
  }
}
