import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OperadorDialogComponent } from './dialogs/operador-dialog.component';
import { AsignarClientesDialogComponent } from './dialogs/asignar-clientes-dialog.component';
import { ConfirmarEliminarDialogComponent } from './dialogs/confirmar-eliminar-dialog.component';
import { EngancheService, Cliente, Operador } from '@core/services/enganche.service';

@Component({
  selector: 'app-gestion-operadores',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './gestion-operadores.component.html',
  styles: [`
    .gestion-operadores-container {
      padding: 20px;
    }
    .actions-container {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-acciones {
      width: 160px;
      text-align: center;
    }
  `]
})
export class GestionOperadoresComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'email', 'telefono', 'clientesAsignados', 'acciones'];
  operadores: Operador[] = [];
  clientes: Cliente[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private engancheService: EngancheService
  ) {}

  ngOnInit() {
    this.cargarOperadores();
    this.cargarClientes();
  }

  cargarOperadores() {
    this.engancheService.getOperadores().subscribe(operadores => {
      this.operadores = operadores;
    });
  }

  cargarClientes() {
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  agregarOperador() {
    const dialogRef = this.dialog.open(OperadorDialogComponent, {
      ...OperadorDialogComponent.getDialogConfig(),
      data: {
        title: 'Nuevo Operador'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevoOperador: Operador = {
          id: this.operadores.length + 1,
          ...result,
          clientesAsignados: []
        };
        this.operadores = [...this.operadores, nuevoOperador];
        this.snackBar.open('Operador agregado con éxito', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  editarOperador(operador: Operador) {
    const dialogRef = this.dialog.open(OperadorDialogComponent, {
      ...OperadorDialogComponent.getDialogConfig(),
      data: {
        title: 'Editar Operador',
        ...operador
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.operadores = this.operadores.map(op => {
          if (op.id === operador.id) {
            return {
              ...op,
              ...result
            };
          }
          return op;
        });
        this.snackBar.open('Operador actualizado con éxito', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  asignarClientes(operador: Operador) {
    const dialogRef = this.dialog.open(AsignarClientesDialogComponent, {
      ...AsignarClientesDialogComponent.getDialogConfig(),
      data: {
        operador,
        clientesDisponibles: this.clientes,
        clientesAsignados: this.clientes.filter(c => operador.clientesAsignados.includes(c.id))
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.operadores = this.operadores.map(op => {
          if (op.id === operador.id) {
            return {
              ...op,
              clientesAsignados: result.clientesAsignados.map((c: Cliente) => c.id)
            };
          }
          return op;
        });
        this.snackBar.open('Clientes asignados con éxito', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  eliminarOperador(operador: Operador) {
    const dialogRef = this.dialog.open(ConfirmarEliminarDialogComponent, {
      ...ConfirmarEliminarDialogComponent.getDialogConfig(),
      data: {
        nombre: operador.nombre
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.operadores = this.operadores.filter(op => op.id !== operador.id);
        this.snackBar.open('Operador eliminado con éxito', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  getClientesAsignadosText(operador: Operador): string {
    return this.clientes
      .filter(c => operador.clientesAsignados.includes(c.id))
      .map(c => c.nombre)
      .join(', ');
  }
}
