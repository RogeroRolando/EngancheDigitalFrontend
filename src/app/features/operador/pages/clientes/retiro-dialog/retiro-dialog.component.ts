import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface DialogData {
  clienteId: number;
  saldoDisponible: number;
  fecha: Date;
}

@Component({
  selector: 'app-retiro-dialog',
  templateUrl: './retiro-dialog.component.html',
  styleUrls: ['./retiro-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class RetiroDialogComponent {
  retiroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RetiroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.retiroForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(1), Validators.max(data.saldoDisponible)]],
      motivo: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.retiroForm.valid) {
      this.dialogRef.close({
        ...this.retiroForm.value,
        clienteId: this.data.clienteId,
        fecha: this.data.fecha
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  formatMonto(monto: number): string {
    return monto.toLocaleString('es-CL');
  }
}
