import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

type EstadoTransferencia = 'Pendiente' | 'Completado' | 'Rechazado';

interface Cliente {
  id: number;
  nombre: string;
  rut: string;
}

interface Transferencia {
  fechaHora: string;
  monto: number;
  estado: EstadoTransferencia;
  clienteId: number;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9' },
    { id: 2, nombre: 'María González', rut: '98.765.432-1' },
    { id: 3, nombre: 'Carlos Rodríguez', rut: '11.222.333-4' },
    { id: 4, nombre: 'Ana Silva', rut: '44.555.666-7' },
    { id: 5, nombre: 'Pedro Martínez', rut: '77.888.999-0' }
  ];

  displayedColumns: string[] = ['fechaHora', 'monto', 'estado', 'acciones'];
  todasLasTransferencias: Transferencia[] = [
    // Juan Pérez - 3 transferencias (1 pendiente, 1 completada, 1 rechazada)
    {
      fechaHora: '2025-03-13 10:30',
      monto: 50000,
      estado: 'Pendiente',
      clienteId: 1
    },
    {
      fechaHora: '2025-03-13 11:15',
      monto: 75000,
      estado: 'Completado',
      clienteId: 1
    },
    {
      fechaHora: '2025-03-12 15:45',
      monto: 30000,
      estado: 'Rechazado',
      clienteId: 1
    },
    // María González - 2 transferencias (1 pendiente, 1 completada)
    {
      fechaHora: '2025-03-12 09:30',
      monto: 100000,
      estado: 'Pendiente',
      clienteId: 2
    },
    {
      fechaHora: '2025-03-12 10:15',
      monto: 80000,
      estado: 'Completado',
      clienteId: 2
    },
    // Carlos Rodríguez - 2 transferencias (1 completada, 1 rechazada)
    {
      fechaHora: '2025-03-11 14:20',
      monto: 25000,
      estado: 'Rechazado',
      clienteId: 3
    },
    {
      fechaHora: '2025-03-11 16:45',
      monto: 80000,
      estado: 'Completado',
      clienteId: 3
    },
    // Ana Silva - 2 transferencias (1 pendiente, 1 rechazada)
    {
      fechaHora: '2025-03-13 08:15',
      monto: 45000,
      estado: 'Pendiente',
      clienteId: 4
    },
    {
      fechaHora: '2025-03-12 13:30',
      monto: 60000,
      estado: 'Rechazado',
      clienteId: 4
    },
    // Pedro Martínez - 2 transferencias (1 pendiente, 1 completada)
    {
      fechaHora: '2025-03-11 11:00',
      monto: 35000,
      estado: 'Pendiente',
      clienteId: 5
    },
    {
      fechaHora: '2025-03-13 09:45',
      monto: 90000,
      estado: 'Completado',
      clienteId: 5
    }
  ];

  dataSource: Transferencia[] = [];
  estadisticas = {
    pendientes: 0,
    completados: 0,
    rechazados: 0
  };

  clienteSeleccionado: number | null = null;
  fechaSeleccionada: Date | null = null;

  constructor() {}

  ngOnInit(): void {
    this.actualizarEstadisticas(this.todasLasTransferencias);
    this.dataSource = this.todasLasTransferencias;
  }

  private actualizarEstadisticas(transferencias: Transferencia[]) {
    this.estadisticas = {
      pendientes: transferencias.filter(t => t.estado === 'Pendiente').length,
      completados: transferencias.filter(t => t.estado === 'Completado').length,
      rechazados: transferencias.filter(t => t.estado === 'Rechazado').length
    };
  }

  buscarTransferencias() {
    let transferenciasFiltradas = [...this.todasLasTransferencias];

    if (this.clienteSeleccionado) {
      transferenciasFiltradas = transferenciasFiltradas.filter(
        t => t.clienteId === this.clienteSeleccionado
      );
    }

    if (this.fechaSeleccionada) {
      const fechaSeleccionada = new Date(this.fechaSeleccionada);
      fechaSeleccionada.setHours(0, 0, 0, 0);
      
      transferenciasFiltradas = transferenciasFiltradas.filter(t => {
        const fechaTransferencia = new Date(t.fechaHora);
        return fechaTransferencia.toDateString() === fechaSeleccionada.toDateString();
      });
    }

    this.dataSource = transferenciasFiltradas;
    this.actualizarEstadisticas(transferenciasFiltradas);
  }

  verDetalle(transferencia: Transferencia) {
    const cliente = this.clientes.find(c => c.id === transferencia.clienteId);
    console.log('Ver detalle:', { ...transferencia, cliente });
  }

  limpiarFiltros() {
    this.clienteSeleccionado = null;
    this.fechaSeleccionada = null;
    this.dataSource = this.todasLasTransferencias;
    this.actualizarEstadisticas(this.todasLasTransferencias);
  }
}
