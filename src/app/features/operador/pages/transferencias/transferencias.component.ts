import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgregarTransferenciaDialogComponent } from './dialogs/agregar-transferencia-dialog.component';
import { VerComprobanteDialogComponent } from './dialogs/ver-comprobante-dialog.component';
import { ClpPipe } from '@core/pipes/clp.pipe';

interface Transferencia {
  id: number;
  fecha: string;
  cliente: string;
  importe: number;
  estado: 'Pendiente' | 'Completado';
  comprobante?: string;
}

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
    ClpPipe
  ],
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.scss']
})
export class TransferenciasComponent {
  displayedColumns: string[] = ['fecha', 'cliente', 'importe', 'estado', 'acciones'];
  
  transferencias: Transferencia[] = [
    {
      id: 1,
      fecha: '2024-02-25 14:30',
      cliente: 'Cliente A',
      importe: 150000,
      estado: 'Pendiente'
    },
    {
      id: 2,
      fecha: '2024-02-25 13:15',
      cliente: 'Cliente B',
      importe: 250000,
      estado: 'Completado',
      comprobante: 'assets/images/comprobante1.jpg'
    },
    {
      id: 3,
      fecha: '2024-02-25 12:45',
      cliente: 'Cliente C',
      importe: 350000,
      estado: 'Completado',
      comprobante: 'assets/images/comprobante2.jpg'
    }
  ];

  constructor(private dialog: MatDialog) {}

  agregarTransferencia() {
    const dialogRef = this.dialog.open(AgregarTransferenciaDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí se procesaría el guardado en el backend
        const nuevaTransferencia: Transferencia = {
          id: this.transferencias.length + 1,
          fecha: new Date().toLocaleString(),
          cliente: result.cliente.nombre, // Ahora usamos el nombre del objeto cliente
          importe: result.importe,
          estado: 'Pendiente',
          comprobante: URL.createObjectURL(result.comprobante)
        };
        
        this.transferencias = [nuevaTransferencia, ...this.transferencias];
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
    // Implementar edición si es necesario
    console.log('Editar transferencia:', transferencia);
  }
}
