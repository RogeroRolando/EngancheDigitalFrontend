import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  nombre: string;
}

@Component({
  selector: 'app-confirmar-eliminar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <h2>Confirmar Eliminación</h2>
    </div>

    <div class="content-container">
      <p class="confirmation-message">
        <mat-icon class="warning-icon">warning</mat-icon>
        ¿Está seguro que desea eliminar al cliente <strong>{{data.nombre}}</strong>?
      </p>
      <p class="warning-text">Esta acción no se puede deshacer.</p>

      <div class="dialog-actions">
        <button mat-button (click)="onCancel()">
          Cancelar
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          Eliminar
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 400px;
      max-width: 500px;
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

    .content-container {
      padding: 24px;
    }

    .confirmation-message {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      font-size: 1.1rem;

      .warning-icon {
        color: #f44336;
        width: 28px;
        height: 28px;
        font-size: 28px;
      }
    }

    .warning-text {
      color: rgba(0, 0, 0, 0.6);
      margin: 0 0 24px 40px;
      font-size: 0.9rem;
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
export class ConfirmarEliminarDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarEliminarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
