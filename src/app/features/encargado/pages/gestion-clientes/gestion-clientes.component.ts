import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { EngancheService, Cliente } from '@core/services/enganche.service';
import { ClienteDialogComponent } from './dialogs/cliente-dialog.component';
import { ClientesTableComponent } from './components/clientes-table.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    ClientesTableComponent
  ],
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.scss']
})
export class GestionClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clientesFiltradosPaginados: Cliente[] = [];
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 0;
  sortConfig: Sort = { active: 'nombre', direction: 'asc' };

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
        (cliente.email && cliente.email.toLowerCase().includes(searchTermLower)) ||
        (cliente.datosBancarios?.numeroCuenta && cliente.datosBancarios.numeroCuenta.includes(searchTermLower))
      );
    }
    this.aplicarOrdenamiento();
  }

  private aplicarOrdenamiento(): void {
    if (this.sortConfig.direction === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados.sort((a, b) => {
        const isAsc = this.sortConfig.direction === 'asc';
        switch (this.sortConfig.active) {
          case 'nombre':
            return this.comparar(a.nombre, b.nombre, isAsc);
          case 'rut':
            return this.comparar(a.rut || '', b.rut || '', isAsc);
          case 'email':
            return this.comparar(a.email || '', b.email || '', isAsc);
          case 'banco':
            return this.comparar(
              a.datosBancarios?.banco || 0,
              b.datosBancarios?.banco || 0,
              isAsc
            );
          case 'tipoCuenta':
            return this.comparar(
              a.datosBancarios?.tipoCuenta || 0,
              b.datosBancarios?.tipoCuenta || 0,
              isAsc
            );
          case 'numeroCuenta':
            return this.comparar(
              a.datosBancarios?.numeroCuenta || '',
              b.datosBancarios?.numeroCuenta || '',
              isAsc
            );
          default:
            return 0;
        }
      });
    }
    this.actualizarPaginacion();
  }

  private comparar(a: any, b: any, isAsc: boolean): number {
    if (a === b) return 0;
    const comparison = a < b ? -1 : 1;
    return isAsc ? comparison : -comparison;
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

  onSortChange(sort: Sort): void {
    this.sortConfig = sort;
    this.aplicarOrdenamiento();
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
        this.engancheService.agregarCliente(result).subscribe(() => {
          this.cargarClientes();
        });
      }
    });
  }

  editarCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: {
        title: 'Editar Cliente',
        cliente
      },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.engancheService.editarCliente(cliente.id, result).subscribe(() => {
          this.cargarClientes();
        });
      }
    });
  }

  eliminarCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Cliente',
        message: `¿Está seguro que desea eliminar al cliente ${cliente.nombre}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí deberíamos llamar al servicio para eliminar el cliente
        // Por ahora solo lo desactivamos
        this.engancheService.editarCliente(cliente.id, { activo: false }).subscribe(() => {
          this.cargarClientes();
        });
      }
    });
  }

  toggleEstadoCliente(cliente: Cliente): void {
    const nuevoEstado = !cliente.activo;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: nuevoEstado ? 'Activar Cliente' : 'Desactivar Cliente',
        message: `¿Está seguro que desea ${nuevoEstado ? 'activar' : 'desactivar'} al cliente ${cliente.nombre}?`,
        type: nuevoEstado ? 'info' : 'warning',
        confirmText: nuevoEstado ? 'Activar' : 'Desactivar'
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        cliente.activo = nuevoEstado;
        this.filtrarClientes();
      }
    });
  }
}
