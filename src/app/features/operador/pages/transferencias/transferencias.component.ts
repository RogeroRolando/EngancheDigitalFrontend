import { Component, OnInit } from '@angular/core';
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
    ClpPipe
  ],
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.scss']
})
export class TransferenciasComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'cliente', 'importe', 'estado', 'acciones'];
  transferencias: Transferencia[] = [];

  constructor(
    private dialog: MatDialog,
    private engancheService: EngancheService
  ) {}

  ngOnInit(): void {
    this.cargarTransferencias();
  }

  private cargarTransferencias(): void {
    this.engancheService.getTransferencias().subscribe(transferencias => {
      this.transferencias = transferencias;
    });
  }

  agregarTransferencia() {
    const dialogRef = this.dialog.open(AgregarTransferenciaDialogComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevaTransferencia: Omit<Transferencia, 'id'> = {
          fecha: new Date().toLocaleString(),
          cliente: result.cliente.nombre,
          importe: result.importe,
          estado: 'Pendiente',
          comprobante: URL.createObjectURL(result.comprobante)
        };
        
        this.engancheService.agregarTransferencia(nuevaTransferencia)
          .subscribe(transferencia => {
            this.transferencias = [transferencia, ...this.transferencias];
          });
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
