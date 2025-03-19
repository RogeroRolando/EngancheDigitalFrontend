import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { BaseDialogComponent } from '@core/components/base-dialog/base-dialog.component';
import { Cliente, EngancheService } from '@core/services/enganche.service';

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
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    BaseDialogComponent
  ],
  templateUrl: './cliente-dialog.component.html',
  styleUrls: ['./cliente-dialog.component.scss']
})
export class ClienteDialogComponent {
  clienteForm: FormGroup;
  bancos: { id: number; nombre: string }[] = [];
  tiposCuenta: { id: number; nombre: string }[] = [];

  constructor(
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private engancheService: EngancheService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      activo: [true],
      datosBancarios: this.fb.group({
        banco: [null, Validators.required],
        tipoCuenta: [null, Validators.required],
        numeroCuenta: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
      })
    });

    // Cargar datos bancarios
    this.engancheService.getBancos().subscribe(bancos => {
      this.bancos = bancos;
    });

    this.engancheService.getTiposCuenta().subscribe(tipos => {
      this.tiposCuenta = tipos;
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
