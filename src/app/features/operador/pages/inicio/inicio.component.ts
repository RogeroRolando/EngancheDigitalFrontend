import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { VerComprobanteDialogComponent } from '../transferencias/dialogs/ver-comprobante-dialog.component';
import { EngancheService, Transferencia, DashboardStats } from '@core/services/enganche.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule
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
export class InicioComponent implements OnInit {
  operadoresActivos = 0;
  activeClients = 0;
  pendingTransfers = 0;
  totalTransferred = 0;

  displayedColumns: string[] = ['fecha', 'cliente', 'importe', 'estado', 'acciones'];
  transferencias: Transferencia[] = [];

  constructor(
    private dialog: MatDialog,
    private engancheService: EngancheService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.engancheService.getDashboardStats().subscribe(stats => {
      this.operadoresActivos = stats.operadoresActivos;
      this.activeClients = stats.clientesActivos;
      this.pendingTransfers = stats.transferenciasPendientes;
      this.totalTransferred = stats.totalTransferido;
    });

    this.engancheService.getTransferenciasRecientes().subscribe(transferencias => {
      this.transferencias = transferencias;
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

  verComprobante(transferencia: Transferencia) {
    if (transferencia.comprobante) {
      this.dialog.open(VerComprobanteDialogComponent, {
        data: { comprobante: transferencia.comprobante },
        width: '90%',
        maxWidth: '600px',
        panelClass: 'comprobante-dialog'
      });
    }
  }
}
