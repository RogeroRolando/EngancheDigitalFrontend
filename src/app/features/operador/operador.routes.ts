import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { TransferenciasComponent } from './pages/transferencias/transferencias.component';

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
  }
] as Routes;
