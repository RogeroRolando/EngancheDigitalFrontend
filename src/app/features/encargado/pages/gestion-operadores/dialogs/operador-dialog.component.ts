import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-operador-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './operador-dialog.component.html',
  styleUrls: ['./operador-dialog.component.scss']
})
export class OperadorDialogComponent {
  form: FormGroup;

  static getDialogConfig() {
    return {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'operador-dialog',
      disableClose: false
    };
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OperadorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      nombre?: string;
      email?: string;
      telefono?: string;
    }
  ) {
    this.form = this.fb.group({
      nombre: [data.nombre || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      telefono: [data.telefono || '', [Validators.pattern(/^\+569\d{8}$/)]]
    });

    // Configurar el comportamiento al hacer clic fuera del diálogo
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close();
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
