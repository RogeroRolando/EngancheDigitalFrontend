import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BaseDialogComponent } from '@core/components/base-dialog/base-dialog.component';

@Component({
  selector: 'app-ver-comprobante-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    BaseDialogComponent
  ],
  templateUrl: './ver-comprobante-dialog.component.html',
  styleUrls: ['./ver-comprobante-dialog.component.scss']
})
export class VerComprobanteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VerComprobanteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comprobante: string }
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
