import { Routes } from '@angular/router';

export const ENCARGADO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'gestion-operadores',
    loadComponent: () => import('./pages/gestion-operadores/gestion-operadores.component').then(m => m.GestionOperadoresComponent)
  },
  {
    path: 'gestion-clientes',
    loadComponent: () => import('./pages/gestion-clientes/gestion-clientes.component').then(m => m.GestionClientesComponent)
  },
  // {
  //   path: 'validacion-transferencias',
  //   loadComponent: () => import('./pages/validacion-transferencias/validacion-transferencias.component').then(m => m.ValidacionTransferenciasComponent)
  // },
];
