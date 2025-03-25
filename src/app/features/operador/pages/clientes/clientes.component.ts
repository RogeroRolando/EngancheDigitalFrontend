import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RetiroDialogComponent } from './retiro-dialog/retiro-dialog.component';
import { EngancheService, Cliente, MovimientoCliente } from '@core/services/enganche.service';
import { firstValueFrom } from 'rxjs';
import { ClpPipe } from '@shared/pipes/clp.pipe';

interface MovimientoAgrupado {
  carrera: number;
  transferencia: number;
  venta: number;
  pago: number;
  retiro: number;
  propina: number;
  saldo: number;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ClpPipe
  ]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  fechaSeleccionada: Date = new Date(2025, 2, 8); // 8 de marzo de 2025
  fechasReunion: Date[] = [
    new Date(2025, 2, 8), // 8 de marzo 2025
    new Date(2025, 2, 15) // 15 de marzo 2025
  ];
  movimientosAgrupados: MovimientoAgrupado[] = [];
  displayedColumns: string[] = ['carrera', 'transferencia', 'venta', 'pago', 'retiro', 'propina', 'saldo'];

  constructor(
    private engancheService: EngancheService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.clientes = await firstValueFrom(this.engancheService.getClientes());
    if (this.clienteSeleccionado) {
      await this.cargarMovimientos();
    }
  }

  async seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    if (this.fechaSeleccionada) {
      await this.cargarMovimientos();
    }
  }

  async onFechaChange(fecha: Date | null) {
    if (fecha) {
      this.fechaSeleccionada = fecha;
      if (this.clienteSeleccionado) {
        await this.cargarMovimientos();
      }
    }
  }

  fechaReunionClass = (fecha: Date): string => {
    return this.esFechaReunion(fecha) ? 'fecha-reunion' : '';
  };

  esFechaReunion = (fecha: Date): boolean => {
    return this.fechasReunion.some(f => 
      f.getFullYear() === fecha.getFullYear() &&
      f.getMonth() === fecha.getMonth() &&
      f.getDate() === fecha.getDate()
    );
  };

  async cargarMovimientos() {
    if (!this.clienteSeleccionado || !this.fechaSeleccionada) return;

    const movimientos = await firstValueFrom(
      this.engancheService.getMovimientosCliente(this.clienteSeleccionado.id, this.fechaSeleccionada)
    );

    this.movimientosAgrupados = this.agruparMovimientosPorCarrera(movimientos);
  }

  agruparMovimientosPorCarrera(movimientos: MovimientoCliente[]): MovimientoAgrupado[] {
    const grupos = new Map<number, MovimientoAgrupado>();

    movimientos.forEach(mov => {
      if (!grupos.has(mov.Carrera)) {
        grupos.set(mov.Carrera, {
          carrera: mov.Carrera,
          transferencia: 0,
          venta: 0,
          pago: 0,
          retiro: 0,
          propina: 0,
          saldo: 0
        });
      }

      const grupo = grupos.get(mov.Carrera)!;
      switch (mov.TipoMov.toLowerCase()) {
        case 'transferencia':
          grupo.transferencia = mov.Monto;
          break;
        case 'venta':
          grupo.venta = mov.Monto;
          break;
        case 'pago':
          grupo.pago = mov.Monto;
          break;
        case 'retiro':
          grupo.retiro = mov.Monto;
          break;
        case 'propina':
          grupo.propina = mov.Monto;
          break;
      }
      grupo.saldo = mov.Saldo;
    });

    return Array.from(grupos.values());
  }

  calcularSaldoDisponible(): number {
    if (!this.movimientosAgrupados.length) return 0;
    return this.movimientosAgrupados[this.movimientosAgrupados.length - 1].saldo;
  }

  async abrirDialogoRetiro() {
    if (!this.clienteSeleccionado) return;

    const dialogRef = this.dialog.open(RetiroDialogComponent, {
      width: '400px',
      data: {
        clienteId: this.clienteSeleccionado.id,
        saldoDisponible: this.calcularSaldoDisponible(),
        fecha: this.fechaSeleccionada
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      await this.cargarMovimientos();
    }
  }
}
