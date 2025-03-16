import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
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
        this.clientes = this.clientes.map(c =>
          c.id === cliente.id ? { ...result, id: cliente.id } : c
        );
        this.filtrarClientes();
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
