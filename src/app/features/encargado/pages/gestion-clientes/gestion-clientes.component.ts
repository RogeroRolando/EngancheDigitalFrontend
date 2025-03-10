import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteDialogComponent } from './dialogs/cliente-dialog.component';
import { ConfirmarEliminarDialogComponent } from './dialogs/confirmar-eliminar-dialog.component';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './gestion-clientes.component.html',
  styles: [`
    .gestion-clientes-container {
      padding: 20px;
    }
    .actions-container {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-acciones {
      width: 100px;
      text-align: center;
    }
  `]
})
export class GestionClientesComponent {
  displayedColumns: string[] = ['nombre', 'email', 'telefono', 'acciones'];
  clientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Cliente 1',
      email: 'cliente1@example.com',
      telefono: '123456789'
    }
  ];

  constructor(private dialog: MatDialog) {}

  agregarCliente() {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: {
        title: 'Nuevo Cliente'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoCliente: Cliente = {
          id: this.clientes.length + 1,
          ...result
        };
        this.clientes = [...this.clientes, nuevoCliente];
      }
    });
  }

  editarCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      data: {
        title: 'Editar Cliente',
        ...cliente
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientes = this.clientes.map(c =>
          c.id === result.id ? result : c
        );
      }
    });
  }

  eliminarCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(ConfirmarEliminarDialogComponent, {
      data: {
        nombre: cliente.nombre
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientes = this.clientes.filter(c => c.id !== cliente.id);
      }
    });
  }
}
