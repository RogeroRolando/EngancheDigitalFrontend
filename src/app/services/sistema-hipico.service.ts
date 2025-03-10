import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FSC, Preparador } from '@interfaces/gremio';

@Injectable({
  providedIn: 'root',
})
export class SistemaHipicoService {
  constructor() {}

  getPreparadores(filter: string): Observable<Preparador[]> {
    return of<Preparador[]>([
      {
        rut: '12345678-9',
        name: 'Preparador 1',
      },
      {
        rut: '98765432-1',
        name: 'Preparador 2',
      },
      {
        rut: '11111111-1',
        name: 'Preparador 3',
      },
    ]);
  }

  getFSC(filter: string): Observable<FSC[]> {
    return of<FSC[]>([
      {
        rut: '12345678-9',
        name: 'FSC 1',
      },
      {
        rut: '98765432-1',
        name: 'FSC 2',
      },
      {
        rut: '11111111-1',
        name: 'FSC 3',
      },
    ]);
  }
}
