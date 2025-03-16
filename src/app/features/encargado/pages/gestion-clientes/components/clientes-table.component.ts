import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Cliente } from '@core/services/enganche.service';
import { EstadoBadgeComponent } from '../../../../../shared/components/estado-badge/estado-badge.component';
import { TableContainerComponent } from '../../../../../shared/components/table-container/table-container.component';

@Component({
  selector: 'app-clientes-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    EstadoBadgeComponent,
    TableContainerComponent
  ],
  templateUrl: './clientes-table.component.html',
  styleUrls: ['./clientes-table.component.scss']
})
export class ClientesTableComponent {
  @Input() clientes: Cliente[] = [];
  @Input() pageSize: number = 10;
  @Output() onEdit = new EventEmitter<Cliente>();
  @Output() onToggleEstado = new EventEmitter<Cliente>();
  @Output() onPageChange = new EventEmitter<PageEvent>();

  columnas: string[] = ['nombre', 'rut', 'email', 'estado', 'acciones'];

  onPageChanged(event: PageEvent): void {
    this.onPageChange.emit(event);
  }
}
