import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VerComprobanteDialogComponent } from '../transferencias/dialogs/ver-comprobante-dialog.component';

interface Client {
  id: number;
  name: string;
}

interface Transfer {
  id: number;
  date: Date;
  client: string;
  amount: number;
  status: string;
  comprobante: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTableModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './inicio.component.html',
  styles: [`
    .dashboard-container {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
      box-sizing: border-box;
    }

    .summary-cards {
      display: flex;
      gap: 24px;
      width: 100%;
    }

    .summary-card {
      flex: 1;
      background: white;
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;

      .title {
        color: #666;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .value {
        font-size: 32px;
        font-weight: 500;
      }
    }

    .selector-card {
      width: 100%;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      mat-card-header {
        padding: 16px;
        border-bottom: 1px solid #eee;
        
        mat-card-title {
          font-size: 16px;
          font-weight: 500;
          color: #1a237e;
          margin: 0;
        }
      }

      mat-card-content {
        padding: 16px;
      }

      .selector-form {
        display: flex;
        gap: 24px;
        width: 100%;

        mat-form-field {
          flex: 1;
          width: 100%;
        }
      }
    }

    .activity-summary-card {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      mat-card-header {
        padding: 16px;
        
        mat-card-title {
          font-size: 16px;
          font-weight: 500;
          color: #1a237e;
          margin: 0;
        }
      }

      mat-card-content {
        padding: 0 16px 16px 16px;
      }

      .summary-item {
        margin-bottom: 12px;

        .label {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .value {
          font-size: 16px;
          font-weight: 500;
          color: #000;

          &.warning {
            color: #ff9800;
          }
        }
      }
    }

    .transfers-card {
      width: 100%;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      mat-card-header {
        padding: 16px;
        
        mat-card-title {
          font-size: 16px;
          font-weight: 500;
          color: #1a237e;
          margin: 0;
        }
      }

      mat-card-content {
        padding: 16px;
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
      }

      th {
        color: #1a237e;
        font-weight: 500;
        font-size: 14px;
        padding: 12px 16px;
        text-align: left;
        background: white;

        &.mat-column-amount {
          padding-right: 48px;
        }

        &.mat-column-status {
          padding-left: 24px;
        }
      }

      td {
        padding: 12px 16px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.87);
        border-top: 1px solid #f0f0f0;

        &.mat-column-amount {
          padding-right: 48px;
        }

        &.mat-column-status {
          padding-left: 24px;
        }
      }

      .mat-column-date {
        width: 150px;
      }

      .mat-column-client {
        width: 200px;
      }

      .mat-column-amount {
        width: 100px;
        text-align: right;
      }

      .mat-column-status {
        width: 120px;
      }

      .status-badge {
        font-size: 14px;
        font-weight: normal;

        &.pendiente {
          color: #ff9800;
        }

        &.completado {
          color: #4caf50;
        }

        &.rechazado {
          color: #f44336;
        }
      }

      .mat-column-actions {
        width: 120px;
        text-align: center;
        padding: 12px 8px;

        button {
          margin: 0 4px;
        }
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .selector-form {
        flex-direction: column;
      }

      .transfers-card {
        overflow-x: auto;

        table {
          min-width: 800px;
        }
      }
    }
  `]
})
export class InicioComponent {
  constructor(private dialog: MatDialog) {}

  selectedClient: number | null = null;
  selectedDate: Date | null = null;
  pendingTransfers = 8;
  activeClients = 120;
  operadoresActivos = 5;
  totalTransferred = 25000;

  clients: Client[] = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María González' },
    { id: 3, name: 'Carlos Rodríguez' }
  ];

  displayedColumns: string[] = ['date', 'client', 'amount', 'status', 'actions'];
  transfers: Transfer[] = [
    {
      id: 1,
      date: new Date(),
      client: 'Juan Pérez',
      amount: 5000,
      status: 'Pendiente',
      comprobante: 'assets/images/comprobante1.jpg'
    },
    {
      id: 2,
      date: new Date(),
      client: 'María González',
      amount: 10000,
      status: 'Completado',
      comprobante: 'assets/images/comprobante2.jpg'
    },
    {
      id: 3,
      date: new Date(),
      client: 'Carlos Rodríguez',
      amount: 7500,
      status: 'Rechazado',
      comprobante: 'assets/images/comprobante1.jpg'
    }
  ];

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.getTime() <= today.getTime();
  };

  nuevaTransferencia() {
  }

  verComprobante(transfer: any) {
    if (transfer.comprobante) {
      this.dialog.open(VerComprobanteDialogComponent, {
        data: { comprobante: transfer.comprobante },
        width: '90%',
        maxWidth: '600px',
        panelClass: 'comprobante-dialog'
      });
    }
  }
}
