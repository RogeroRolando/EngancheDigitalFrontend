import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content>
      <form [formGroup]="clienteForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" placeholder="Nombre completo">
          <mat-error *ngIf="clienteForm.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>RUT</mat-label>
          <input matInput formControlName="rut" placeholder="12.345.678-9">
          <mat-error *ngIf="clienteForm.get('rut')?.hasError('required')">
            El RUT es requerido
          </mat-error>
          <mat-error *ngIf="clienteForm.get('rut')?.hasError('pattern')">
            El formato del RUT no es válido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Correo electrónico</mat-label>
          <input matInput formControlName="email" placeholder="correo@ejemplo.com">
          <mat-error *ngIf="clienteForm.get('email')?.hasError('email')">
            El correo no es válido
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="activo" class="estado-checkbox">
          Cliente activo
        </mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="!clienteForm.valid"
              (click)="onSubmit()">
        {{data.cliente ? 'Guardar cambios' : 'Crear cliente'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      padding: 8px 0;
    }

    mat-form-field {
      width: 100%;
    }

    .estado-checkbox {
      margin-top: 8px;
    }

    mat-dialog-actions {
      padding: 16px 0 0;
    }
  `]
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
      email: ['', [Validators.email]],
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
