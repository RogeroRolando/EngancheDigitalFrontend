import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cliente, EngancheService } from '@core/services/enganche.service';
import { EstadoBadgeComponent } from '@shared/components/estado-badge/estado-badge.component';
import { TableContainerComponent } from '../../../../../shared/components/table-container/table-container.component';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    EstadoBadgeComponent,
    TableContainerComponent
  ],
  templateUrl: './clientes-table.component.html',
  styleUrls: ['./clientes-table.component.scss']
})
export class ClientesTableComponent implements OnInit {
  @Input() clientes: Cliente[] = [];
  @Input() pageSize: number = 10;
  @Input() totalClientes: number = 0;
  @Input() currentPage: number = 0;

  @Output() editarCliente = new EventEmitter<Cliente>();
  @Output() eliminarCliente = new EventEmitter<Cliente>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  displayedColumns: string[] = [
    'nombre',
    'rut',
    'email',
    'banco',
    'tipoCuenta',
    'numeroCuenta',
    'estado',
    'acciones'
  ];

  private bancos: { id: number; nombre: string }[] = [];
  private tiposCuenta: { id: number; nombre: string }[] = [];

  constructor(private engancheService: EngancheService) {}

  ngOnInit() {
    this.engancheService.getBancos().subscribe(bancos => {
      this.bancos = bancos;
    });

    this.engancheService.getTiposCuenta().subscribe(tipos => {
      this.tiposCuenta = tipos;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onEditar(cliente: Cliente): void {
    this.editarCliente.emit(cliente);
  }

  onEliminar(cliente: Cliente): void {
    this.eliminarCliente.emit(cliente);
  }

  getNombreBanco(bancoId?: number): string {
    if (!bancoId) return 'No especificado';
    const banco = this.bancos.find(b => b.id === bancoId);
    return banco ? banco.nombre : 'No especificado';
  }

  getNombreTipoCuenta(tipoId?: number): string {
    if (!tipoId) return 'No especificado';
    const tipo = this.tiposCuenta.find(t => t.id === tipoId);
    return tipo ? tipo.nombre : 'No especificado';
  }
}
