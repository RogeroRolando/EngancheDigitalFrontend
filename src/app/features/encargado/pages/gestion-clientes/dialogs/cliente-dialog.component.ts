import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  id?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  title: string;
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
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <h2>{{data.title}}</h2>
    </div>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" placeholder="Ingrese el nombre">
        <mat-icon matSuffix>person</mat-icon>
        <mat-error *ngIf="form.get('nombre')?.hasError('required')">
          El nombre es requerido
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" placeholder="Ingrese el email" type="email">
        <mat-icon matSuffix>email</mat-icon>
        <mat-error *ngIf="form.get('email')?.hasError('required')">
          El email es requerido
        </mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">
          Ingrese un email válido
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="telefono" placeholder="Ingrese el teléfono">
        <mat-icon matSuffix>phone</mat-icon>
        <mat-error *ngIf="form.get('telefono')?.hasError('required')">
          El teléfono es requerido
        </mat-error>
      </mat-form-field>

      <div class="dialog-actions">
        <button mat-button type="button" (click)="onCancel()">
          Cancelar
        </button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          Guardar
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 400px;
      max-width: 600px;
      overflow-x: hidden;
    }

    .dialog-header {
      background: #3f51b5;
      margin: 0;
      padding: 20px 24px;
      
      h2 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
      }
    }

    .form-container {
      padding: 24px;
    }

    .mat-mdc-form-field {
      width: 100%;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 24px;
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 8px 0;
      margin-top: 16px;

      button {
        min-width: 120px;
        
        &.mat-mdc-raised-button {
          height: 40px;
        }
      }
    }

    ::ng-deep {
      .mdc-text-field--outlined {
        --mdc-outlined-text-field-container-shape: 8px;
      }

      .mat-mdc-form-field-subscript-wrapper {
        height: 20px;
      }

      .mat-mdc-dialog-container {
        --mdc-dialog-container-shape: 12px;
        overflow-x: hidden;
      }

      .mdc-button {
        --mdc-text-button-label-text-tracking: 0.5px;
        --mdc-filled-button-label-text-tracking: 0.5px;
        --mdc-protected-button-label-text-tracking: 0.5px;
        --mdc-outlined-button-label-text-tracking: 0.5px;
        letter-spacing: var(--mdc-text-button-label-text-tracking);
      }
    }
  `]
})
export class ClienteDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.form = this.fb.group({
      nombre: [data.nombre || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      telefono: [data.telefono || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        id: this.data.id,
        ...this.form.value
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
