import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EngancheService } from '../../../../core/services/enganche.service';
import { Cliente } from '../../../../core/interfaces/cliente.interface';
import { MovimientoCliente } from '../../../../core/interfaces/movimiento-cliente.interface';
import { ResumenCarrera } from '../../../../core/interfaces/resumen-carrera.interface';
import { RetiroDialogComponent } from './retiro-dialog/retiro-dialog.component';
import { ClpPipe } from '../../../../shared/pipes/clp.pipe';

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
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    ClpPipe
  ],
  styles: [`
    .estado-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.3s ease;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &.pendiente {
        background-color: #fff3e0;
        color: #f57c00;
        border: 1px solid #ffb74d;

        &:hover {
          background-color: #ffe0b2;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(255, 152, 0, 0.2);
        }
      }

      &.completado {
        background-color: #e8f5e9;
        color: #43a047;
        border: 1px solid #81c784;

        &:hover {
          background-color: #c8e6c9;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
        }
      }

      &.rechazado {
        background-color: #ffebee;
        color: #e53935;
        border: 1px solid #ef5350;

        &:hover {
          background-color: #ffcdd2;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(244, 67, 54, 0.2);
        }
      }
    }

    .acciones-cell {
      display: flex;
      gap: 8px;
      justify-content: flex-end;

      button {
        min-width: unset;
        padding: 4px;
        line-height: 1;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
  `]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  fechaSeleccionada = new Date();
  movimientos: MovimientoCliente[] = [];
  resumenCarreras: ResumenCarrera[] = [];
  totales: ResumenCarrera = {
    Carrera: 0,
    Transferencia: 0,
    Ventas: 0,
    Pagos: 0,
    Retiros: 0,
    Propinas: 0,
    Saldo: 0
  };
  displayedColumns = ['carrera', 'transfer', 'ventas', 'pagos', 'retiros', 'propinas', 'saldo'];
  maxCarreras = 25;

  constructor(
    private engancheService: EngancheService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.engancheService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  onClienteChange() {
    if (this.clienteSeleccionado) {
      this.cargarMovimientos();
    }
  }

  onFechaChange() {
    if (this.clienteSeleccionado) {
      this.cargarMovimientos();
    }
  }

  cargarMovimientos() {
    if (!this.clienteSeleccionado) return;
    
    const fecha = this.fechaSeleccionada.toISOString().split('T')[0];
    this.engancheService.getMovimientosCliente(this.clienteSeleccionado.id, fecha).subscribe({
      next: (movimientos) => {
        this.movimientos = movimientos;
        this.generarResumenCarreras();
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Error al cargar los movimientos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  generarResumenCarreras() {
    this.resumenCarreras = [];
    this.totales = {
      Carrera: 0,
      Transferencia: 0,
      Ventas: 0,
      Pagos: 0,
      Retiros: 0,
      Propinas: 0,
      Saldo: 0
    };

    // Agrupar movimientos por carrera
    const movimientosPorCarrera = new Map<number, MovimientoCliente[]>();
    this.movimientos.forEach(mov => {
      if (!movimientosPorCarrera.has(mov.Carrera)) {
        movimientosPorCarrera.set(mov.Carrera, []);
      }
      movimientosPorCarrera.get(mov.Carrera)?.push(mov);
    });

    // Procesar solo las carreras con movimientos
    movimientosPorCarrera.forEach((movimientosCarrera, carrera) => {
      const resumen: ResumenCarrera = {
        Carrera: carrera,
        Saldo: 0
      };

      movimientosCarrera.forEach(mov => {
        switch (mov.TipoMov) {
          case 'Transferencia':
            resumen.Transferencia = mov.Monto;
            this.totales.Transferencia = (this.totales.Transferencia || 0) + mov.Monto;
            break;
          case 'Venta':
            resumen.Ventas = (resumen.Ventas || 0) + mov.Monto;
            this.totales.Ventas = (this.totales.Ventas || 0) + mov.Monto;
            break;
          case 'Pago':
            resumen.Pagos = (resumen.Pagos || 0) + mov.Monto;
            this.totales.Pagos = (this.totales.Pagos || 0) + mov.Monto;
            break;
          case 'Retiro':
            resumen.Retiros = (resumen.Retiros || 0) + mov.Monto;
            this.totales.Retiros = (this.totales.Retiros || 0) + mov.Monto;
            break;
          case 'Propina':
            resumen.Propinas = (resumen.Propinas || 0) + mov.Monto;
            this.totales.Propinas = (this.totales.Propinas || 0) + mov.Monto;
            break;
        }
      });

      resumen.Saldo = movimientosCarrera[movimientosCarrera.length - 1].Saldo;
      this.totales.Saldo = resumen.Saldo; // El saldo total es el último saldo
      this.resumenCarreras.push(resumen);
    });

    // Ordenar por número de carrera
    this.resumenCarreras.sort((a, b) => a.Carrera - b.Carrera);
  }

  realizarRetiro(carrera: number) {
    if (!this.clienteSeleccionado) return;

    const resumenCarrera = this.resumenCarreras.find(r => r.Carrera === carrera);
    if (!resumenCarrera || resumenCarrera.Saldo <= 0) return;

    const dialogRef = this.dialog.open(RetiroDialogComponent, {
      width: '400px',
      data: {
        saldoDisponible: resumenCarrera.Saldo
      }
    });

    dialogRef.afterClosed().subscribe((monto: number | undefined) => {
      if (monto && this.clienteSeleccionado) {
        const fecha = this.fechaSeleccionada.toISOString().split('T')[0];
        this.engancheService.realizarRetiro(
          this.clienteSeleccionado.id,
          fecha,
          carrera,
          monto
        ).subscribe({
          next: () => {
            this.snackBar.open('Retiro realizado con éxito', 'Cerrar', { duration: 3000 });
            this.cargarMovimientos();
          },
          error: () => {
            this.snackBar.open('Error al realizar el retiro', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}
