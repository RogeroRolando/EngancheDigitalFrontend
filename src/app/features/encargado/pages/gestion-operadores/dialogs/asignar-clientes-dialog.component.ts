import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cliente, Operador } from '@core/services/enganche.service';
import { EstadoBadgeComponent } from '@shared/components/estado-badge/estado-badge.component';

interface DialogData {
  operador: Operador;
  clientesDisponibles: Cliente[];
  clientesAsignados: Cliente[];
}

@Component({
  selector: 'app-asignar-clientes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    EstadoBadgeComponent
  ],
  templateUrl: './asignar-clientes-dialog.component.html',
  styleUrls: ['./asignar-clientes-dialog.component.scss']
})
export class AsignarClientesDialogComponent implements OnInit {
  readonly maxClientes: number = 10;
  searchTerm: string = '';
  clientesFiltrados: Cliente[] = [];
  clientesSeleccionados: Set<number>;
  clientesOriginales: Set<number>;

  static getDialogConfig(): MatDialogConfig {
    return {
      width: '90vw',
      maxWidth: '1400px',
      height: '90vh',
      maxHeight: '900px',
      panelClass: 'asignar-clientes-dialog'
    };
  }

  get clientesAsignadosFiltrados(): Cliente[] {
    return this.data.clientesDisponibles.filter(cliente => {
      const coincideConBusqueda = !this.searchTerm || 
        cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (cliente.rut && cliente.rut.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (cliente.email && cliente.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return this.clientesSeleccionados.has(cliente.id) && coincideConBusqueda;
    });
  }

  get clientesDisponiblesFiltrados(): Cliente[] {
    return this.data.clientesDisponibles.filter(cliente => {
      const coincideConBusqueda = !this.searchTerm || 
        cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (cliente.rut && cliente.rut.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (cliente.email && cliente.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return !this.clientesSeleccionados.has(cliente.id) && coincideConBusqueda;
    });
  }

  constructor(
    private dialogRef: MatDialogRef<AsignarClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.clientesSeleccionados = new Set(
      data.clientesAsignados.map(cliente => cliente.id)
    );
    this.clientesOriginales = new Set(
      data.clientesAsignados.map(cliente => cliente.id)
    );
  }

  ngOnInit(): void {
    this.filtrarClientes();
  }

  filtrarClientes(): void {
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.clientesFiltrados = this.data.clientesDisponibles.filter(cliente => {
      if (!searchTermLower) return true;
      
      return cliente.nombre.toLowerCase().includes(searchTermLower) ||
             (cliente.rut && cliente.rut.toLowerCase().includes(searchTermLower)) ||
             (cliente.email && cliente.email.toLowerCase().includes(searchTermLower));
    });
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.filtrarClientes();
  }

  isClienteSeleccionado(cliente: Cliente): boolean {
    return this.clientesSeleccionados.has(cliente.id);
  }

  toggleClienteSeleccion(cliente: Cliente): void {
    if (!cliente.activo) return;
    
    if (this.clientesSeleccionados.has(cliente.id)) {
      this.clientesSeleccionados.delete(cliente.id);
    } else if (this.clientesSeleccionados.size < this.maxClientes) {
      this.clientesSeleccionados.add(cliente.id);
    }
  }

  hasChanges(): boolean {
    if (this.clientesSeleccionados.size !== this.clientesOriginales.size) {
      return true;
    }

    for (const id of this.clientesSeleccionados) {
      if (!this.clientesOriginales.has(id)) {
        return true;
      }
    }

    return false;
  }

  onGuardar(): void {
    const clientesAsignados = this.data.clientesDisponibles.filter(
      cliente => this.clientesSeleccionados.has(cliente.id)
    );
    this.dialogRef.close(clientesAsignados);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
