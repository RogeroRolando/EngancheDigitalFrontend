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
  template: `
    <app-base-dialog title="Comprobante de Transferencia">
      <div class="comprobante-container">
        <img [src]="data.comprobante" alt="Comprobante" class="comprobante-img">
      </div>
      <div dialog-actions>
        <button mat-button (click)="cerrar()">
          Cerrar
        </button>
      </div>
    </app-base-dialog>
  `,
  styles: [`
    .comprobante-container {
      width: 100%;
      max-height: 70vh;
      overflow: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }

    .comprobante-img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
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
