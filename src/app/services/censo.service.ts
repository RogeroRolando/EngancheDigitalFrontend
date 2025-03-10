import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CensoFSC, CensusCorral, Corral, Pesebrera, Sector, Zona } from '@interfaces/censo';
import { environment } from '../../environments/environment';

const pesebreras: Pesebrera[] = [
  {
    id: 1,
    name: 'Pesebrera 1',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 2,
    name: 'Pesebrera 2',
    latitude: 0,
    longitude: 0,
  },
  {
    id: 3,
    name: 'Pesebrera 3',
    latitude: 0,
    longitude: 0,
  },
];

@Injectable({
  providedIn: 'root',
})
export class CensoService {
  private apiUrl = environment.backend;
  http = inject(HttpClient);

  getCorrales(sectorId: string): Observable<Corral[]> {
    return this.http.get<Corral[]>(
      `${this.apiUrl}/corral/by-sector/${sectorId}`,
    );
  }

  getPesebrerasByCorral(id: number): Observable<Pesebrera[]> {
    return of<Pesebrera[]>(pesebreras);
  }

  getCensoFSC(censo_id: number, pesebrera_id: number): Observable<CensoFSC> {
    let params = new HttpParams();
    params.set('censo_id', censo_id.toString());
    params.set('pesebrera_id', pesebrera_id.toString());
    return this.http.get<CensoFSC>(`${this.apiUrl}/fsc`, { params: params });
  }

  getZonas(): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this.apiUrl}/zone`);
  }

  getSectorsByZone(zoneId: string): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.apiUrl}/sector/by-zone/${zoneId}`);
  }

  getCorralById(corralId: number): Observable<Corral> {
    return this.http.get<Corral>(`${this.apiUrl}/${corralId}`);
  }

  getCensoCorral(censoId: string, corralId: string) {
    return this.http.get<any>(`/api/census-corral/${censoId}/${corralId}`);
  }

  postCensusCorral(censusCorral: CensusCorral): Observable<any> {
    const url = '/api/census-corral';
    return this.http.post<any>(url, censusCorral);
  }

  putCensusCorral(
    censoId: string,
    corralId: string,
    censusCorral: Omit<CensusCorral, 'censo_id' | 'corral_id'>,
  ): Observable<any> {
    const url = `/api/census-corral/${censoId}/${corralId}`;
    return this.http.put<any>(url, censusCorral, { observe: 'response' });
  }

  getLastFinishedCensus(): Observable<any> {
    return this.http.get<any>('/api/census/last/finished');
  }
}
