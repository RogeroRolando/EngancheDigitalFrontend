import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EngancheService, Cliente } from '@core/services/enganche.service';
import { ClienteDialogComponent } from './dialogs/cliente-dialog.component';

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule
  ],
  template: `
    <div class="content-container">
      <div class="header-container">
        <h1>Gestión de Clientes</h1>
        <button mat-raised-button color="primary" (click)="agregarCliente()">
          <mat-icon>add</mat-icon>
          Nuevo Cliente
        </button>
      </div>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar cliente</mat-label>
        <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filtrarClientes()" placeholder="Nombre, RUT o correo">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="clientesFiltradosPaginados">
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let cliente">{{cliente.nombre}}</td>
          </ng-container>

          <ng-container matColumnDef="rut">
            <th mat-header-cell *matHeaderCellDef>RUT</th>
            <td mat-cell *matCellDef="let cliente">{{cliente.rut}}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Correo</th>
            <td mat-cell *matCellDef="let cliente">{{cliente.email}}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let cliente">
              <span class="estado-badge" [class.activo]="cliente.activo">
                {{cliente.activo ? 'Activo' : 'Inactivo'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let cliente">
              <button mat-icon-button color="primary" matTooltip="Editar cliente"
                      (click)="editarCliente(cliente)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button [color]="cliente.activo ? 'warn' : 'primary'"
                      [matTooltip]="cliente.activo ? 'Desactivar cliente' : 'Activar cliente'"
                      (click)="toggleEstadoCliente(cliente)">
                <mat-icon>{{cliente.activo ? 'person_off' : 'person'}}</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
        </table>

        <mat-paginator
          [length]="clientesFiltrados.length"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25]"
          (page)="onPageChange($event)"
          aria-label="Seleccionar página">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .content-container {
      padding: 24px;
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        font-size: 24px;
        color: #333;
      }
    }

    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .table-container {
      border-radius: 8px;
      overflow: hidden;
    }

    table {
      width: 100%;
    }

    .mat-column-acciones {
      width: 120px;
      text-align: center;
    }

    .estado-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      background-color: #f44336;
      color: white;

      &.activo {
        background-color: #4caf50;
      }
    }

    @media (max-width: 768px) {
      .content-container {
        padding: 16px;
      }

      .header-container {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .mat-column-email {
        display: none;
      }
    }
  `]
})
export class GestionClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clientesFiltradosPaginados: Cliente[] = [];
  columnas: string[] = ['nombre', 'rut', 'email', 'estado', 'acciones'];
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    private engancheService: EngancheService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.filtrarClientes();
    });
  }

  filtrarClientes(): void {
    if (!this.searchTerm?.trim()) {
      this.clientesFiltrados = [...this.clientes];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTermLower) ||
        (cliente.rut && cliente.rut.toLowerCase().includes(searchTermLower)) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTermLower))
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

  agregarCliente(): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: {
        title: 'Nuevo Cliente'
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Simular la creación de un nuevo cliente
        const nuevoCliente: Cliente = {
          id: Math.max(...this.clientes.map(c => c.id)) + 1,
          ...result
        };
        this.clientes = [...this.clientes, nuevoCliente];
        this.filtrarClientes();
      }
    });
  }

  editarCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: {
        title: 'Editar Cliente',
        cliente: { ...cliente }
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Simular la actualización del cliente
        this.clientes = this.clientes.map(c =>
          c.id === cliente.id ? { ...result, id: cliente.id } : c
        );
        this.filtrarClientes();
      }
    });
  }

  toggleEstadoCliente(cliente: Cliente): void {
    cliente.activo = !cliente.activo;
    // TODO: Implementar actualización en el servicio
    console.log('Toggle estado cliente:', cliente);
  }
}
