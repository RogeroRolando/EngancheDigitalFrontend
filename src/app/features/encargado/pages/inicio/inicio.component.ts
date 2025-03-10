import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';

interface Actividad {
  fecha: string;
  operador: string;
  cliente: string;
  tipo: string;
  estado: string;
}

@Component({
  selector: 'app-inicio-encargado',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './inicio.component.html',
  styles: [`
    .dashboard-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .summary-card {
      mat-card-header {
        padding: 16px 16px 0;

        mat-card-title {
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          color: #1a237e;
        }
      }

      mat-card-content {
        padding: 24px 16px;
        text-align: center;
      }

      .big-number {
        font-size: 48px;
        font-weight: bold;
        color: #3f51b5;
        line-height: 1;
        margin: 0;

        &.warning {
          color: #f44336;
        }
      }
    }

    .actions-section {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;

        mat-icon {
          margin-right: 4px;
        }
      }
    }

    .activity-table-card {
      mat-card-header {
        padding: 16px;

        mat-card-title {
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          color: #1a237e;
        }
      }

      mat-card-content {
        padding: 0;
      }

      table {
        width: 100%;
      }

      th {
        background: #f5f5f5;
        color: rgba(0, 0, 0, 0.87);
        font-weight: 500;
      }

      td {
        color: rgba(0, 0, 0, 0.87);
      }

      tr:hover {
        background: #f5f5f5;
      }

      .mat-column-fecha {
        width: 120px;
      }

      .mat-column-operador,
      .mat-column-cliente {
        min-width: 150px;
      }

      .mat-column-tipo,
      .mat-column-estado {
        width: 120px;
        text-align: center;
      }

      .mat-chip {
        min-height: 24px;
        padding: 4px 12px;
      }
    }

    @media (max-width: 600px) {
      .dashboard-container {
        padding: 16px;
      }

      .summary-section {
        grid-template-columns: 1fr;
      }

      .actions-section {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class InicioComponent {
  operadoresActivos: number = 5;
  clientesTotales: number = 120;
  transferenciasPendientes: number = 8;
  displayedColumns: string[] = ['fecha', 'operador', 'cliente', 'tipo', 'estado'];

  actividades: Actividad[] = [
    {
      fecha: '2024-02-25 14:30',
      operador: 'Juan Pérez',
      cliente: 'Cliente A',
      tipo: 'Transferencia',
      estado: 'Pendiente'
    },
    {
      fecha: '2024-02-25 13:15',
      operador: 'María López',
      cliente: 'Cliente B',
      tipo: 'Registro',
      estado: 'Completado'
    },
    {
      fecha: '2024-02-25 12:45',
      operador: 'Carlos Ruiz',
      cliente: 'Cliente C',
      tipo: 'Transferencia',
      estado: 'Completado'
    }
  ];

  constructor(private router: Router) {}

  navegarA(ruta: string) {
    this.router.navigate(['/encargado', ruta]);
  }
}
