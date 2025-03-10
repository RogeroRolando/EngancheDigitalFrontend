import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './operador-dialog.component.html',
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

    .form-divider {
      margin: 32px 0;
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
export class OperadorDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OperadorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre: [data?.nombre || '', [Validators.required]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      telefono: [data?.telefono || '', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
