import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BaseDialogComponent } from '@core/components/base-dialog/base-dialog.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ver-comprobante-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    BaseDialogComponent
  ],
  templateUrl: './ver-comprobante-dialog.component.html',
  styleUrls: ['./ver-comprobante-dialog.component.scss']
})
export class VerComprobanteDialogComponent {
  imagenSegura: SafeUrl | null = null;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<VerComprobanteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comprobante: string },
    private sanitizer: DomSanitizer
  ) {
    if (data.comprobante) {
      try {
        // La ruta ya viene normalizada desde el servicio con el prefijo '/'
        this.imagenSegura = this.sanitizer.bypassSecurityTrustUrl(data.comprobante);
      } catch (error) {
        console.error('Error al procesar el comprobante:', error);
        this.error = 'No se pudo cargar el comprobante';
      }
    } else {
      this.error = 'No hay comprobante disponible';
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
