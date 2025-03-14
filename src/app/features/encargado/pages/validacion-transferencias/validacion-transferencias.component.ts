import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ValidarTransferenciaDialogComponent } from './dialogs/validar-transferencia-dialog.component';
import { EngancheService, Transferencia } from '@core/services/enganche.service';

@Component({
  selector: 'app-validacion-transferencias',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule
  ],
  templateUrl: './validacion-transferencias.component.html',
  styleUrls: ['./validacion-transferencias.component.scss'],
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
export class ValidacionTransferenciasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'operador', 'cliente', 'importe', 'estado', 'acciones'];
  transferencias: Transferencia[] = [];

  constructor(
    private dialog: MatDialog,
    private engancheService: EngancheService
  ) {}

  ngOnInit(): void {
    this.cargarTransferencias();
  }

  private cargarTransferencias(): void {
    this.engancheService.getTransferenciasValidacion().subscribe(transferencias => {
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

  abrirDialogoValidacion(transferencia: Transferencia) {
    const dialogRef = this.dialog.open(ValidarTransferenciaDialogComponent, {
      width: '500px',
      data: transferencia
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.engancheService.actualizarEstadoTransferenciaValidacion(transferencia.id, 'Completado')
          .subscribe(exito => {
            if (exito) {
              this.cargarTransferencias();
            }
          });
      }
    });
  }
}
