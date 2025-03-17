import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  nombre: string;
}

@Component({
  selector: 'app-confirmar-eliminar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmar-eliminar-dialog.component.html',
  styleUrls: ['./confirmar-eliminar-dialog.component.scss']
})
export class ConfirmarEliminarDialogComponent {
  static getDialogConfig(): MatDialogConfig {
    return {
      width: '400px',
      maxWidth: '90vw',
      panelClass: 'confirmar-eliminar-dialog',
      disableClose: false
    };
  }

  constructor(
    private dialogRef: MatDialogRef<ConfirmarEliminarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // Configurar el comportamiento al hacer clic fuera del diálogo
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
