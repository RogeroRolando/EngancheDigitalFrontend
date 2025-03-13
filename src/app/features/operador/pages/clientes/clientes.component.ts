import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EngancheService, Cliente, Transferencia, TransferenciaStats } from '@core/services/enganche.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  displayedColumns: string[] = ['fecha', 'importe', 'estado', 'acciones'];
  dataSource: Transferencia[] = [];
  estadisticas: TransferenciaStats = {
    pendientes: 0,
    completados: 0,
    rechazados: 0
  };

  clienteSeleccionado: number | null = null;
  fechaSeleccionada: Date | null = null;

  constructor(private engancheService: EngancheService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });

    this.engancheService.getTransferencias().subscribe(transferencias => {
      this.dataSource = transferencias;
      this.estadisticas = this.engancheService.getTransferenciasStats(transferencias);
    });
  }

  buscarTransferencias() {
    if (this.clienteSeleccionado && this.fechaSeleccionada) {
      // Filtrar por cliente y fecha
      this.engancheService.getTransferenciasPorCliente(this.clienteSeleccionado).subscribe(transferencias => {
        this.engancheService.getTransferenciasPorFecha(this.fechaSeleccionada!).subscribe(transferenciasConFecha => {
          const transferenciasComunes = transferencias.filter(t1 => 
            transferenciasConFecha.some(t2 => t2.id === t1.id)
          );
          this.dataSource = transferenciasComunes;
          this.estadisticas = this.engancheService.getTransferenciasStats(transferenciasComunes);
        });
      });
    } else if (this.clienteSeleccionado) {
      // Solo filtrar por cliente
      this.engancheService.getTransferenciasPorCliente(this.clienteSeleccionado).subscribe(transferencias => {
        this.dataSource = transferencias;
        this.estadisticas = this.engancheService.getTransferenciasStats(transferencias);
      });
    } else if (this.fechaSeleccionada) {
      // Solo filtrar por fecha
      this.engancheService.getTransferenciasPorFecha(this.fechaSeleccionada).subscribe(transferencias => {
        this.dataSource = transferencias;
        this.estadisticas = this.engancheService.getTransferenciasStats(transferencias);
      });
    }
  }

  verDetalle(transferencia: Transferencia) {
    const cliente = this.clientes.find(c => c.id === transferencia.clienteId);
    console.log('Ver detalle:', { ...transferencia, cliente });
  }

  limpiarFiltros() {
    this.clienteSeleccionado = null;
    this.fechaSeleccionada = null;
    this.cargarDatos();
  }
}
