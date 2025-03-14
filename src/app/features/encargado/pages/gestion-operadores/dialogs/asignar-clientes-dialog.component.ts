import { Component, Inject, OnInit } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Cliente } from '@core/services/enganche.service';

interface DialogData {
  operador: {
    id: number;
    nombre: string;
  };
  clientesDisponibles: Cliente[];
  clientesAsignados: Cliente[];
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
    MatChipsModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule
  ],
  template: `
    <div class="dialog-header">
      <h2>Asignar Clientes - {{data.operador.nombre}}</h2>
    </div>

    <div class="content-container">
      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar clientes</mat-label>
          <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filtrarClientes()" placeholder="Nombre, RUT o correo">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="clientes-container">
        <mat-card class="clientes-disponibles">
          <mat-card-header>
            <mat-card-title>Clientes Disponibles</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let cliente of clientesFiltradosPaginados" class="cliente-item">
                <div class="cliente-info">
                  <span class="cliente-nombre">{{cliente.nombre}}</span>
                  <div class="cliente-detalles">
                    <span class="cliente-detalle" *ngIf="cliente.rut">
                      <mat-icon class="detalle-icon">badge</mat-icon>
                      RUT: {{cliente.rut}}
                    </span>
                    <span class="cliente-detalle" *ngIf="cliente.email">
                      <mat-icon class="detalle-icon">email</mat-icon>
                      {{cliente.email}}
                    </span>
                  </div>
                </div>
                <button mat-icon-button color="primary" (click)="asignarCliente(cliente)" 
                        matTooltip="Asignar cliente">
                  <mat-icon>add_circle</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
            <mat-paginator
              [length]="clientesFiltrados.length"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 25]"
              (page)="onPageChange($event)"
              aria-label="Seleccionar página">
            </mat-paginator>
          </mat-card-content>
        </mat-card>

        <mat-card class="clientes-asignados">
          <mat-card-header>
            <mat-card-title>
              Clientes Asignados
              <span class="contador-clientes">
                {{clientesAsignados.length}} cliente(s)
              </span>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let cliente of clientesAsignados" class="cliente-item">
                <div class="cliente-info">
                  <span class="cliente-nombre">{{cliente.nombre}}</span>
                  <div class="cliente-detalles">
                    <span class="cliente-detalle" *ngIf="cliente.rut">
                      <mat-icon class="detalle-icon">badge</mat-icon>
                      RUT: {{cliente.rut}}
                    </span>
                    <span class="cliente-detalle" *ngIf="cliente.email">
                      <mat-icon class="detalle-icon">email</mat-icon>
                      {{cliente.email}}
                    </span>
                  </div>
                </div>
                <button mat-icon-button color="warn" (click)="removerCliente(cliente)"
                        matTooltip="Remover cliente">
                  <mat-icon>remove_circle</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()">Guardar</button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 600px;
      max-width: 800px;
    }

    .dialog-header {
      padding: 16px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .content-container {
      padding: 16px;
      max-height: calc(80vh - 130px);
      overflow-y: auto;
      min-height: 400px;
    }

    .search-container {
      margin-bottom: 16px;
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 1;
      padding: 8px 0;
    }

    .search-field {
      width: 100%;
    }

    .clientes-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
      min-height: 300px;
    }

    .clientes-disponibles,
    .clientes-asignados {
      height: 100%;
      min-height: 300px;
    }

    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      min-height: 200px;
    }

    .cliente-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border-bottom: 1px solid #f0f0f0;
      min-height: 64px;
      white-space: normal;
      height: auto;
    }

    .cliente-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding-right: 16px;
      overflow: hidden;
    }

    .cliente-nombre {
      font-weight: 500;
      white-space: normal;
      word-wrap: break-word;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .cliente-detalles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cliente-detalle {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
      white-space: normal;
      word-wrap: break-word;
      line-height: 1.2;
    }

    .detalle-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }

    mat-list-item {
      height: auto !important;
    }

    ::ng-deep .mat-mdc-list-item-content {
      height: auto !important;
      min-height: 48px !important;
    }

    .dialog-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .contador-clientes {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin-left: 8px;
    }

    @media (max-width: 768px) {
      :host {
        min-width: 320px;
      }

      .clientes-container {
        grid-template-columns: 1fr;
      }

      .content-container {
        max-height: calc(90vh - 180px);
        padding: 8px;
      }

      .cliente-item {
        padding: 12px 8px;
      }

      .cliente-nombre {
        font-size: 14px;
      }

      .cliente-detalle {
        font-size: 11px;
      }

      .detalle-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .dialog-actions {
        padding: 8px;
      }

      mat-card {
        margin-bottom: 16px;
      }
    }

    @media (max-width: 480px) {
      :host {
        min-width: 280px;
      }

      .dialog-header h2 {
        font-size: 18px;
      }

      .search-field {
        font-size: 14px;
      }

      .content-container {
        padding: 4px;
      }
    }
  `]
})
export class AsignarClientesDialogComponent implements OnInit {
  clientesAsignados: Cliente[] = [];
  clientesDisponibles: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clientesFiltradosPaginados: Cliente[] = [];
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    public dialogRef: MatDialogRef<AsignarClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.clientesAsignados = [...(this.data?.clientesAsignados || [])];
    this.actualizarClientesDisponibles();
  }

  private actualizarClientesDisponibles(): void {
    const idsAsignados = new Set(this.clientesAsignados.map((c: Cliente) => c.id));
    this.clientesDisponibles = (this.data?.clientesDisponibles || []).filter(
      (cliente: Cliente) => !idsAsignados.has(cliente.id) && cliente.activo
    );
    this.filtrarClientes();
  }

  filtrarClientes(): void {
    if (!this.searchTerm?.trim()) {
      this.clientesFiltrados = [...this.clientesDisponibles];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.clientesFiltrados = this.clientesDisponibles.filter((cliente: Cliente) =>
        cliente.nombre.toLowerCase().includes(searchTermLower) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTermLower)) ||
        (cliente.rut && cliente.rut.toLowerCase().includes(searchTermLower))
      );
    }
    this.currentPage = 0;
    this.actualizarPaginacion();
  }

  private actualizarPaginacion(): void {
    const inicio = this.currentPage * this.pageSize;
    const fin = inicio + this.pageSize;
    this.clientesFiltradosPaginados = this.clientesFiltrados.slice(inicio, fin);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPaginacion();
  }

  asignarCliente(cliente: Cliente): void {
    if (cliente && !this.clientesAsignados.some(c => c.id === cliente.id)) {
      this.clientesAsignados = [...this.clientesAsignados, cliente];
      this.actualizarClientesDisponibles();
    }
  }

  removerCliente(cliente: Cliente): void {
    if (cliente) {
      this.clientesAsignados = this.clientesAsignados.filter((c: Cliente) => c.id !== cliente.id);
      this.actualizarClientesDisponibles();
    }
  }

  onSubmit(): void {
    this.dialogRef.close({
      clientesAsignados: [...this.clientesAsignados]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
