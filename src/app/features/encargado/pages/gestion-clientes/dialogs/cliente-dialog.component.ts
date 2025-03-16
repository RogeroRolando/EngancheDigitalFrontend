import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Cliente } from '@core/services/enganche.service';

interface DialogData {
  title: string;
  cliente?: Cliente;
}

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './cliente-dialog.component.html',
  styleUrls: ['./cliente-dialog.component.scss']
})
export class ClienteDialogComponent {
  clienteForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      activo: [true]
    });

    if (data.cliente) {
      this.clienteForm.patchValue(data.cliente);
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const cliente = {
        ...this.data.cliente,
        ...this.clienteForm.value
      };
      this.dialogRef.close(cliente);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
