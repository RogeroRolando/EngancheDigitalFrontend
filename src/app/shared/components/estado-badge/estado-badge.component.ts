import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-estado-badge',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './estado-badge.component.html',
  styleUrls: ['./estado-badge.component.scss']
})
export class EstadoBadgeComponent {
  @Input() activo: boolean = false;
}
