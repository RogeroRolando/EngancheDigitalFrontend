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
  styleUrls: ['./validacion-transferencias.component.scss']
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
