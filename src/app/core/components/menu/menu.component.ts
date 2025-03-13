import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Module } from '@core/interfaces/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatExpansionModule, MatListModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  modules: Module[] = [
    {
      name: 'encargado',
      menus: [
        {
          id: '1',
          name: 'inicio',
          displayName: 'Inicio'
        },
        {
          id: '2',
          name: 'gestion-operadores',
          displayName: 'Gestión de Operadores'
        },
        {
          id: '3',
          name: 'gestion-clientes',
          displayName: 'Gestión de Clientes'
        },
        {
          id: '4',
          name: 'validacion-transferencias',
          displayName: 'Validación de Transferencias'
        }
      ]
    },
    {
      name: 'operador',
      menus: [
        {
          id: '1',
          name: 'inicio',
          displayName: 'Inicio'
        },
        {
          id: '2',
          name: 'transferencias',
          displayName: 'Mis Transferencias'
        },
        {
          id: '3',
          name: 'clientes',
          displayName: 'Clientes'
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  generateRoute(moduleName: string, menuName: string): string {
    return `/${moduleName}/${menuName}`;
  }

  navigateTo(moduleName: string, menuName: string) {
    const route = this.generateRoute(moduleName, menuName);
    this.router.navigate([route.substring(1)])
      .then(() => {})
      .catch(error => {});
  }
}
