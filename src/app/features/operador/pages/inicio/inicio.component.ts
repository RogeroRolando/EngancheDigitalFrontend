import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VerComprobanteDialogComponent } from '../transferencias/dialogs/ver-comprobante-dialog.component';

type EstadoTransferencia = 'Pendiente' | 'Completado' | 'Rechazado';

interface Transferencia {
  date: string;
  client: string;
  amount: number;
  status: EstadoTransferencia;
  comprobante: string;
}

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
  operadoresActivos = 5;
  activeClients = 12;
  pendingTransfers = 4;
  totalTransferred = 25000;

  displayedColumns: string[] = ['date', 'client', 'amount', 'status', 'actions'];
  transfers: Transferencia[] = [
    {
      date: '2025-03-13 10:30',
      client: 'Cliente 1',
      amount: 50000,
      status: 'Pendiente',
      comprobante: 'assets/images/comprobante1.jpg'
    },
    {
      date: '2025-03-13 11:15',
      client: 'Cliente 2',
      amount: 75000,
      status: 'Completado',
      comprobante: 'assets/images/comprobante2.jpg'
    },
    {
      date: '2025-03-13 09:45',
      client: 'Cliente 3',
      amount: 30000,
      status: 'Rechazado',
      comprobante: 'assets/images/comprobante1.jpg'
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

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
