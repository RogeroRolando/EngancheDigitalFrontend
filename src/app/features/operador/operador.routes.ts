import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TransferenciasComponent } from './pages/transferencias/transferencias.component';
import { ClientesComponent } from './pages/clientes/clientes.component';

export default [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'transferencias',
    component: TransferenciasComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  }
] as Routes;
