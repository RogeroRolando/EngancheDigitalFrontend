import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClpPipe } from '@core/pipes/clp.pipe';

interface RetiroDialogData {
  saldoDisponible: number;
}

@Component({
  selector: 'app-retiro-dialog',
  template: `
    <h2 mat-dialog-title>Realizar Retiro</h2>
    <mat-dialog-content>
      <form [formGroup]="retiroForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Saldo Disponible</mat-label>
          <input matInput [value]="data.saldoDisponible | number:'1.0-0' | clp" readonly>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Monto a Retirar</mat-label>
          <input matInput type="number" formControlName="monto"
                 [max]="data.saldoDisponible"
                 [min]="1">
          <mat-error *ngIf="retiroForm.get('monto')?.errors?.['required']">
            El monto es requerido
          </mat-error>
          <mat-error *ngIf="retiroForm.get('monto')?.errors?.['max']">
            El monto no puede ser mayor al saldo disponible
          </mat-error>
          <mat-error *ngIf="retiroForm.get('monto')?.errors?.['min']">
            El monto debe ser mayor a 0
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="!retiroForm.valid"
              (click)="onConfirm()">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ClpPipe
  ]
})
export class RetiroDialogComponent {
  retiroForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RetiroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RetiroDialogData,
    private fb: FormBuilder
  ) {
    this.retiroForm = this.fb.group({
      monto: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(data.saldoDisponible)
      ]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.retiroForm.valid) {
      this.dialogRef.close(this.retiroForm.get('monto')?.value);
    }
  }
}
