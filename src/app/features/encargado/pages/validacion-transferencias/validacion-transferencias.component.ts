import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ValidarTransferenciaDialogComponent } from './dialogs/validar-transferencia-dialog.component';
import { Transferencia } from './transferencia.interface';

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
  ],
  templateUrl: './validacion-transferencias.component.html',
  styleUrls: ['./validacion-transferencias.component.scss']
})
export class ValidacionTransferenciasComponent {
  displayedColumns: string[] = ['fecha', 'operador', 'cliente', 'importe', 'estado', 'acciones'];

  // Datos de ejemplo
  transferencias: Transferencia[] = [
    {
      id: 1,
      fecha: '2024-01-15',
      operador: 'Juan Pérez',
      cliente: 'Carlos Rodríguez',
      importe: 1500.00,
      estado: 'Pendiente',
      comprobante: './assets/images/comprobante1.jpg'
    },
    {
      id: 2,
      fecha: '2024-01-14',
      operador: 'María García',
      cliente: 'Ana López',
      importe: 2300.50,
      estado: 'Completado',
      comprobante: './assets/images/comprobante2.jpg'
    }
  ];

  constructor(private dialog: MatDialog) {}

  abrirDialogoValidacion(transferencia: Transferencia) {
    const dialogRef = this.dialog.open(ValidarTransferenciaDialogComponent, {
      width: '500px',
      data: transferencia
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transferencias = this.transferencias.map(t => {
          if (t.id === transferencia.id) {
            return { ...t, estado: 'Completado' };
          }
          return t;
        });
      }
    });
  }
}
