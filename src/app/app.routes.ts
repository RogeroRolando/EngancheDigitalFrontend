import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'encargado',
    pathMatch: 'full'
  },
  {
    path: 'operador',
    loadChildren: () => import('./features/operador/operador.routes')
  },
  {
    path: 'encargado',
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadComponent: () => import('./features/encargado/pages/inicio/inicio.component').then(m => m.InicioComponent)
      },
      {
        path: 'gestion-clientes',
        loadComponent: () => import('./features/encargado/pages/gestion-clientes/gestion-clientes.component').then(m => m.GestionClientesComponent)
      },
      {
        path: 'gestion-operadores',
        loadComponent: () => import('./features/encargado/pages/gestion-operadores/gestion-operadores.component').then(m => m.GestionOperadoresComponent)
      },
      {
        path: 'validacion-transferencias',
        loadComponent: () => import('./features/encargado/pages/validacion-transferencias/validacion-transferencias.component').then(m => m.ValidacionTransferenciasComponent)
      }
    ]
  }
];
