import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { EngancheService, Actividad } from '@core/services/enganche.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  styles: [`
    .dashboard-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h2 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
      font-weight: 500;
      animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .status-card {
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s ease;
      cursor: pointer;
      animation: cardAppear 0.5s ease-out backwards;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);

        .icon-container mat-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .number {
          transform: scale(1.05);
        }
      }

      @for $i from 1 through 3 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.1}s;
        }
      }

      &.pending {
        background-color: #fff3e0;
        .icon-container {
          color: #ff9800;
        }
      }

      &.completed {
        background-color: #e8f5e9;
        .icon-container {
          color: #4caf50;
        }
      }

      &.rejected {
        background-color: #ffebee;
        .icon-container {
          color: #f44336;
        }
      }

      .card-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .icon-container {
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }
      }

      .info-container {
        .number {
          font-size: 24px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
          transition: transform 0.3s ease;
        }

        .label {
          font-size: 14px;
          color: #666;
          transition: color 0.3s ease;
        }
      }
    }

    @keyframes cardAppear {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
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
        transition: all 0.3s ease;
        animation: buttonSlideIn 0.5s ease-out backwards;

        @for $i from 1 through 3 {
          &:nth-child(#{$i}) {
            animation-delay: #{0.2 + ($i * 0.1)}s;
          }
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);

          mat-icon {
            transform: rotate(10deg);
          }
        }

        mat-icon {
          margin-right: 4px;
          transition: transform 0.3s ease;
        }
      }
    }

    @keyframes buttonSlideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .activity-table-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      animation: slideUpFade 0.5s ease-out;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }

      mat-card-header {
        padding: 16px;

        mat-card-title {
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          color: #333;
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
        color: #333;
        font-weight: 500;
        font-size: 14px;
        transition: background-color 0.3s ease;
      }

      td {
        color: #666;
        font-size: 14px;
        transition: all 0.3s ease;
      }

      tr {
        transition: all 0.3s ease;

        &:hover {
          background: #f8f8f8;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);

          td {
            color: #333;
          }
        }
      }

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
    }

    @keyframes slideUpFade {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
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

      .activity-table-card {
        overflow-x: auto;

        table {
          min-width: 800px;
        }
      }
    }
  `]
})
export class InicioComponent implements OnInit {
  operadoresActivos: number = 0;
  clientesTotales: number = 0;
  transferenciasPendientes: number = 0;
  displayedColumns: string[] = ['fecha', 'operador', 'cliente', 'tipo', 'estado'];
  actividades: Actividad[] = [];

  constructor(
    private router: Router,
    private engancheService: EngancheService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.engancheService.getDashboardEncargadoStats().subscribe(stats => {
      this.operadoresActivos = stats.operadoresActivos;
      this.clientesTotales = stats.clientesTotales;
      this.transferenciasPendientes = stats.transferenciasPendientes;
    });

    this.engancheService.getActividades().subscribe(actividades => {
      this.actividades = actividades;
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

  navegarA(ruta: string) {
    this.router.navigate(['/encargado', ruta]);
  }
}
