import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

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
  telefono?: string;
  activo: boolean;
  clientesAsignados: number[];
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
      estado: 'Pendiente',
      comprobante: '/assets/images/comprobante1.jpg'
    },
    {
      id: 2,
      fecha: '2025-03-13 11:15',
      cliente: 'Juan Pérez',
      clienteId: 1,
      importe: 75000,
      estado: 'Completado',
      comprobante: '/assets/images/comprobante2.jpg'
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
    // 4 Transferencias Pendientes
    {
      id: 1,
      fecha: '2025-03-14 09:30',
      operador: 'Juan Pérez',
      cliente: 'Carlos Rodríguez',
      importe: 150000,
      estado: 'Pendiente',
      comprobante: '/assets/images/comprobante1.jpg'
    },
    {
      id: 2,
      fecha: '2025-03-14 09:15',
      operador: 'María López',
      cliente: 'Ana Silva',
      importe: 230000,
      estado: 'Pendiente',
      comprobante: '/assets/images/comprobante2.jpg'
    },
    {
      id: 3,
      fecha: '2025-03-14 09:00',
      operador: 'Carlos Ruiz',
      cliente: 'Pedro Martínez',
      importe: 180000,
      estado: 'Pendiente',
      comprobante: '/assets/images/comprobante3.jpg'
    },
    {
      id: 4,
      fecha: '2025-03-14 08:45',
      operador: 'Juan Pérez',
      cliente: 'María González',
      importe: 120000,
      estado: 'Pendiente',
      comprobante: '/assets/images/comprobante4.jpg'
    },
    // 3 Transferencias Completadas
    {
      id: 5,
      fecha: '2025-03-14 08:30',
      operador: 'María López',
      cliente: 'Luis Sánchez',
      importe: 90000,
      estado: 'Completado',
      comprobante: '/assets/images/comprobante5.jpg'
    },
    {
      id: 6,
      fecha: '2025-03-14 08:15',
      operador: 'Carlos Ruiz',
      cliente: 'Ana Torres',
      importe: 175000,
      estado: 'Completado',
      comprobante: '/assets/images/comprobante6.jpg'
    },
    {
      id: 7,
      fecha: '2025-03-14 08:00',
      operador: 'Juan Pérez',
      cliente: 'Jorge Muñoz',
      importe: 145000,
      estado: 'Completado',
      comprobante: '/assets/images/comprobante7.jpg'
    },
    // 5 Transferencias Rechazadas
    {
      id: 8,
      fecha: '2025-03-14 07:45',
      operador: 'María López',
      cliente: 'Carmen Rojas',
      importe: 200000,
      estado: 'Rechazado',
      comprobante: '/assets/images/comprobante8.jpg'
    },
    {
      id: 9,
      fecha: '2025-03-14 07:30',
      operador: 'Carlos Ruiz',
      cliente: 'Roberto Díaz',
      importe: 160000,
      estado: 'Rechazado',
      comprobante: '/assets/images/comprobante9.jpg'
    },
    {
      id: 10,
      fecha: '2025-03-14 07:15',
      operador: 'Juan Pérez',
      cliente: 'Patricia Vega',
      importe: 135000,
      estado: 'Rechazado',
      comprobante: '/assets/images/comprobante10.jpg'
    },
    {
      id: 11,
      fecha: '2025-03-14 07:00',
      operador: 'María López',
      cliente: 'Fernando Castro',
      importe: 190000,
      estado: 'Rechazado',
      comprobante: '/assets/images/comprobante11.jpg'
    },
    {
      id: 12,
      fecha: '2025-03-14 06:45',
      operador: 'Carlos Ruiz',
      cliente: 'Laura Vargas',
      importe: 170000,
      estado: 'Rechazado',
      comprobante: '/assets/images/comprobante12.jpg'
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
    { 
      id: 1, 
      nombre: 'Juan Pérez', 
      email: 'juan@enganche.com', 
      telefono: '+56912345678',
      activo: true, 
      clientesAsignados: [1, 2] 
    },
    { 
      id: 2, 
      nombre: 'María López', 
      email: 'maria@enganche.com', 
      telefono: '+56923456789',
      activo: true, 
      clientesAsignados: [3] 
    },
    { 
      id: 3, 
      nombre: 'Carlos Ruiz', 
      email: 'carlos@enganche.com', 
      telefono: '+56934567890',
      activo: true, 
      clientesAsignados: [4, 5] 
    },
    { 
      id: 4, 
      nombre: 'Ana García', 
      email: 'ana@enganche.com', 
      telefono: '+56945678901',
      activo: false, 
      clientesAsignados: [] 
    }
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
    // Simular un pequeño delay para emular una llamada al servidor
    return of([...this.transferencias].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )).pipe(delay(300));
  }

  getTransferenciasRecientes(limite: number = 3): Observable<Transferencia[]> {
    return of(this.transferencias.slice(0, limite)).pipe(delay(300));
  }

  getTransferenciasPorCliente(clienteId: number): Observable<Transferencia[]> {
    return of(this.transferencias.filter(t => t.clienteId === clienteId)).pipe(delay(300));
  }

  getTransferenciasPorFecha(fecha: Date): Observable<Transferencia[]> {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    return of(this.transferencias.filter(t => {
      const fechaTransferencia = new Date(t.fecha);
      return fechaTransferencia >= fechaInicio && fechaTransferencia <= fechaFin;
    })).pipe(delay(300));
  }

  getTransferenciasValidacion(): Observable<Transferencia[]> {
    return of(this.transferenciasValidacion).pipe(delay(300));
  }

  actualizarEstadoTransferenciaValidacion(id: number, estado: EstadoTransferencia): Observable<boolean> {
    const index = this.transferenciasValidacion.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transferenciasValidacion[index].estado = estado;
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  agregarTransferencia(transferencia: Omit<Transferencia, 'id'>): Observable<Transferencia> {
    const nuevaTransferencia: Transferencia = {
      ...transferencia,
      id: Math.max(...this.transferencias.map(t => t.id), 0) + 1,
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    // Validar y normalizar el comprobante si existe
    if (nuevaTransferencia.comprobante !== undefined && nuevaTransferencia.comprobante !== null) {
      if (!nuevaTransferencia.comprobante.startsWith('/') && !nuevaTransferencia.comprobante.startsWith('data:')) {
        nuevaTransferencia.comprobante = '/' + nuevaTransferencia.comprobante;
      }
    }
    
    // Agregar al inicio del arreglo
    this.transferencias = [nuevaTransferencia, ...this.transferencias];
    this.actualizarEstadisticas();
    
    return of(nuevaTransferencia).pipe(delay(300));
  }

  editarTransferencia(id: number, transferencia: Partial<Transferencia>): Observable<Transferencia> {
    const index = this.transferencias.findIndex(t => t.id === id);
    if (index !== -1) {
      // Asegurar que los números sean números
      if (typeof transferencia.importe === 'string') {
        transferencia.importe = Number(transferencia.importe);
      }

      // Validar y normalizar el comprobante si existe
      if (transferencia.comprobante !== undefined && transferencia.comprobante !== null) {
        if (!transferencia.comprobante.startsWith('/') && !transferencia.comprobante.startsWith('data:')) {
          transferencia.comprobante = '/' + transferencia.comprobante;
        }
      }

      // Crear una nueva instancia con los cambios
      const transferenciaActualizada = {
        ...this.transferencias[index],
        ...transferencia,
        id // Mantener el ID original
      };
      
      // Actualizar el arreglo de forma inmutable
      this.transferencias = [
        ...this.transferencias.slice(0, index),
        transferenciaActualizada,
        ...this.transferencias.slice(index + 1)
      ];
      
      // Actualizar estadísticas
      this.actualizarEstadisticas();
      
      // Simular delay de servidor y devolver la transferencia actualizada
      return of(transferenciaActualizada).pipe(delay(300));
    }
    throw new Error('Transferencia no encontrada');
  }

  // Métodos para Clientes
  getClientes(): Observable<Cliente[]> {
    return of(this.clientes).pipe(delay(300));
  }

  getClientesActivos(): Observable<Cliente[]> {
    return of(this.clientes.filter(cliente => cliente.activo)).pipe(delay(300));
  }

  // Métodos para Operadores
  getOperadores(): Observable<Operador[]> {
    return of(this.operadores).pipe(delay(300));
  }

  getOperadoresActivos(): Observable<Operador[]> {
    return of(this.operadores.filter(operador => operador.activo)).pipe(delay(300));
  }

  // Métodos para Actividades
  getActividades(): Observable<Actividad[]> {
    return of(this.actividades).pipe(delay(300));
  }

  getActividadesRecientes(limite: number = 3): Observable<Actividad[]> {
    return of(this.actividades.slice(0, limite)).pipe(delay(300));
  }

  // Métodos para Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return of(this.dashboardStats).pipe(delay(300));
  }

  getDashboardEncargadoStats(): Observable<DashboardEncargadoStats> {
    return of({
      operadoresActivos: this.operadores.filter(op => op.activo).length,
      clientesTotales: this.clientes.length,
      transferenciasPendientes: this.transferencias.filter(t => t.estado === 'Pendiente').length
    }).pipe(delay(300));
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
    const stats = this.getTransferenciasStats(this.transferencias);
    this.dashboardStats = {
      ...this.dashboardStats,
      transferenciasPendientes: stats.pendientes,
      totalTransferido: this.transferencias
        .filter(t => t.estado === 'Completado')
        .reduce((sum, t) => Number(t.importe) || 0, 0)
    };
  }
}
