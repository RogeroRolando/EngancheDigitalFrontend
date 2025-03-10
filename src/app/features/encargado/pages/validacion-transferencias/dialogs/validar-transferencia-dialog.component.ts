import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Transferencia } from '../transferencia.interface';

@Component({
  selector: 'app-validar-transferencia-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './validar-transferencia-dialog.component.html',
  styleUrls: ['./validar-transferencia-dialog.component.scss']
})
export class ValidarTransferenciaDialogComponent {
  placeholderImage = './assets/images/placeholder.png';

  constructor(
    private dialogRef: MatDialogRef<ValidarTransferenciaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transferencia
  ) {}

  handleImageError(event: any): void {
    event.target.src = this.placeholderImage;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onValidate(): void {
    this.dialogRef.close(true);
  }
}
