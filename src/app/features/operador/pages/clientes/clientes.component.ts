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
import { EngancheService, Cliente, Transferencia, TransferenciaStats } from '@core/services/enganche.service';

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
  ],
  styles: [`
    .estado-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.3s ease;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &.pendiente {
        background-color: #fff3e0;
        color: #f57c00;
        border: 1px solid #ffb74d;

        &:hover {
          background-color: #ffe0b2;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(255, 152, 0, 0.2);
        }
      }

      &.completado {
        background-color: #e8f5e9;
        color: #43a047;
        border: 1px solid #81c784;

        &:hover {
          background-color: #c8e6c9;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
        }
      }

      &.rechazado {
        background-color: #ffebee;
        color: #e53935;
        border: 1px solid #ef5350;

        &:hover {
          background-color: #ffcdd2;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(244, 67, 54, 0.2);
        }
      }
    }

    .acciones-cell {
      display: flex;
      gap: 8px;
      justify-content: flex-end;

      button {
        min-width: unset;
        padding: 4px;
        line-height: 1;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
  `]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['fecha', 'importe', 'estado', 'acciones'];
  dataSource: Transferencia[] = [];
  estadisticas: TransferenciaStats = {
    pendientes: 0,
    completados: 0,
    rechazados: 0
  };

  clienteSeleccionado: number | null = null;
  fechaSeleccionada: Date | null = null;

  constructor(private engancheService: EngancheService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });

    this.engancheService.getTransferencias().subscribe(transferencias => {
      this.dataSource = transferencias;
      this.estadisticas = this.engancheService.getTransferenciasStats(transferencias);
    });
  }

  getEstadoIcon(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'schedule';
      case 'completado':
        return 'check_circle';
      case 'rechazado':
        return 'cancel';
      default:
        return 'info';
    }
  }

  buscarTransferencias() {
    if (this.clienteSeleccionado && this.fechaSeleccionada) {
      // Filtrar por cliente y fecha
      this.engancheService.getTransferenciasPorCliente(this.clienteSeleccionado).subscribe(transferencias => {
        this.engancheService.getTransferenciasPorFecha(this.fechaSeleccionada!).subscribe(transferenciasConFecha => {
          const transferenciasComunes = transferencias.filter(t1 => 
            transferenciasConFecha.some(t2 => t2.id === t1.id)
          );
          this.dataSource = transferenciasComunes;
          this.estadisticas = this.engancheService.getTransferenciasStats(transferenciasComunes);
        });
      });
    } else if (this.clienteSeleccionado) {
      // Solo filtrar por cliente
      this.engancheService.getTransferenciasPorCliente(this.clienteSeleccionado).subscribe(transferencias => {
        this.dataSource = transferencias;
        this.estadisticas = this.engancheService.getTransferenciasStats(transferencias);
      });
    } else if (this.fechaSeleccionada) {
      // Solo filtrar por fecha
      this.engancheService.getTransferenciasPorFecha(this.fechaSeleccionada).subscribe(transferencias => {
        this.dataSource = transferencias;
        this.estadisticas = this.engancheService.getTransferenciasStats(transferencias);
      });
    }
  }

  verDetalle(transferencia: Transferencia) {
    const cliente = this.clientes.find(c => c.id === transferencia.clienteId);
    console.log('Ver detalle:', { ...transferencia, cliente });
  }

  limpiarFiltros() {
    this.clienteSeleccionado = null;
    this.fechaSeleccionada = null;
    this.cargarDatos();
  }
}
