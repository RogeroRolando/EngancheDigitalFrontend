import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule
  ]
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
