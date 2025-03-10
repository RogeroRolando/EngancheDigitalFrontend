import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

interface Cliente {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-asignar-clientes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatTooltipModule,
    MatBadgeModule,
    MatChipsModule
  ],
  templateUrl: './asignar-clientes-dialog.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 500px;
      max-width: 700px;
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

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      
      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }

      .counter {
        background: #e8eaf6;
        color: #3f51b5;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 500;
      }
    }

    .clients-list {
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
      margin: 0;
      padding: 0;

      .mat-mdc-list-item {
        border-radius: 8px;
        margin-bottom: 8px;
        background: #f8f9fa;
        transition: background-color 0.2s;

        &:hover {
          background: #f1f3f4;
        }

        .mdc-list-item__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
        }
      }
    }

    .client-chip {
      background: #e8eaf6;
      color: #3f51b5;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      transition: all 0.2s;

      &:hover {
        background: #c5cae9;
      }

      .remove-button {
        opacity: 0.7;
        
        &:hover {
          opacity: 1;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: rgba(0, 0, 0, 0.6);
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
    }

    .mat-mdc-form-field {
      width: 100%;
    }

    .form-divider {
      margin: 32px 0;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 8px 0;
      margin-top: 24px;

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
export class AsignarClientesDialogComponent {
  clientesAsignados: Cliente[] = [];
  clientesDisponibles: Cliente[] = [];

  constructor(
    private dialogRef: MatDialogRef<AsignarClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      operador: { id: number; nombre: string };
      clientesAsignados: Cliente[];
      clientesDisponibles: Cliente[];
    }
  ) {
    // Inicializar las listas con los datos recibidos
    this.clientesAsignados = [...(data.clientesAsignados || [])];
    this.clientesDisponibles = [...(data.clientesDisponibles || [])];
  }

  asignarCliente(cliente: Cliente) {
    if (this.clientesAsignados.length >= 10) return;
    
    const index = this.clientesDisponibles.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      this.clientesDisponibles.splice(index, 1);
      this.clientesAsignados.push(cliente);
    }
  }

  desasignarCliente(cliente: Cliente) {
    const index = this.clientesAsignados.findIndex(c => c.id === cliente.id);
    if (index !== -1) {
      this.clientesAsignados.splice(index, 1);
      this.clientesDisponibles.push(cliente);
    }
  }

  guardarCambios() {
    this.dialogRef.close({
      clientesAsignados: this.clientesAsignados,
      clientesDisponibles: this.clientesDisponibles
    });
  }
}
