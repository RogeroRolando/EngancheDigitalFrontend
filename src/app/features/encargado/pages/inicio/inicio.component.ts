import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { EngancheService, Actividad, TransferenciaStats } from '@core/services/enganche.service';
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
  styleUrls: ['./inicio.component.scss'],
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
  ]
})
export class InicioComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'operador', 'cliente', 'tipo', 'estado'];
  actividades: Actividad[] = [];
  stats: TransferenciaStats = {
    pendientes: 0,
    completados: 0,
    rechazados: 0
  };

  constructor(
    private router: Router,
    private engancheService: EngancheService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    // Cargar transferencias para validación y calcular estadísticas
    this.engancheService.getTransferenciasValidacion().subscribe(transferencias => {
      this.stats = this.engancheService.getTransferenciasStats(transferencias);

      // Convertir las últimas 3 transferencias a actividades
      this.actividades = transferencias
        .slice(0, 3)
        .map(t => ({
          fecha: t.fecha,
          operador: t.operador || '',
          cliente: t.cliente,
          tipo: 'Transferencia',
          estado: t.estado === 'Completado' ? 'Completado' : 'Pendiente'
        }));
    });
  }

  irAGestionarOperadores(): void {
    this.router.navigate(['/encargado/gestion-operadores']);
  }

  irAGestionarClientes(): void {
    this.router.navigate(['/encargado/gestion-clientes']);
  }

  irAValidarTransferencias(): void {
    this.router.navigate(['/encargado/validacion-transferencias']);
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
}
