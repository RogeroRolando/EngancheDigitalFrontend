import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { AgregarTransferenciaDialogComponent } from './dialogs/agregar-transferencia-dialog.component';
import { VerComprobanteDialogComponent } from './dialogs/ver-comprobante-dialog.component';
import { ClpPipe } from '@core/pipes/clp.pipe';
import { EngancheService, Transferencia } from '@core/services/enganche.service';

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    ClpPipe
  ],
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.scss'],
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
export class TransferenciasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'cliente', 'importe', 'estado', 'acciones'];
  transferencias: Transferencia[] = [];

  constructor(
    private dialog: MatDialog,
    private engancheService: EngancheService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTransferencias();
  }

  private cargarTransferencias(): void {
    this.engancheService.getTransferencias().subscribe({
      next: (transferencias) => {
        // Asegurar que los importes sean números
        this.transferencias = transferencias.map(t => ({
          ...t,
          importe: Number(t.importe)
        }));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar transferencias:', error);
      }
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

  agregarTransferencia() {
    const dialogRef = this.dialog.open(AgregarTransferenciaDialogComponent, {
      width: '600px',
      disableClose: false,
      data: {
        modo: 'crear'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarTransferencias();
      }
    });
  }

  verTransferencia(transferencia: Transferencia) {
    if (transferencia.comprobante) {
      this.dialog.open(VerComprobanteDialogComponent, {
        data: { comprobante: transferencia.comprobante },
        width: '600px'
      });
    }
  }

  editarTransferencia(transferencia: Transferencia) {
    const dialogRef = this.dialog.open(AgregarTransferenciaDialogComponent, {
      width: '600px',
      disableClose: false,
      data: {
        modo: 'editar',
        transferencia: transferencia
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarTransferencias();
      }
    });
  }
}
