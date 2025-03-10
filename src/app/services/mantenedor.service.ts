import { Injectable } from '@angular/core';
import { Censo, Corral, Pesebrera, Sector, Zona } from '@interfaces/mantenedor';
import { Observable, of } from 'rxjs';
import { HttpClient,} from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MantenedorService {
  private apiUrl = environment.backend

  constructor(private http: HttpClient) {}


  getZones(): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this.apiUrl}/zone`);
  }

  postZone(zone: Omit<Zona, 'id'>): Observable<Zona> {
    return this.http.post<Zona>(`${this.apiUrl}/zone`, zone);
  }

  putZone(zone: Zona): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}/zone/${zone.id}`, zone);
  }

  deleteZone(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/zone/${id}`);
  }

  getSectorByZone(zoneId: string): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.apiUrl}/sector/by-zone/${zoneId}`);
  }

 postSector(sector: Omit<Sector, 'id'>): Observable<Sector> {
    return this.http.post<Sector>(`${this.apiUrl}/sector`, sector);
  }

  getSectorById(sectorId: string): Observable<Sector> {
    return this.http.get<Sector>(`${this.apiUrl}/sector/${sectorId}`);
  }

 putSector(sector: Sector): Observable<Sector> {
    return this.http.put<Sector>(`${this.apiUrl}/sector/${sector.id}`, sector);
  }

  deleteSector(sectorId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sector/${sectorId}`);
  }

  getCorralesBySector(sectorId: string): Observable<Corral[]> {
    return this.http.get<Corral[]>(`${this.apiUrl}/corral/by-sector/${sectorId}`);
  }

  postCorral(corral: Omit<Corral, 'id'>): Observable<Corral> {
    return this.http.post<Corral>(`${this.apiUrl}/corral`, corral);
  }

  putCorral(corral: Corral): Observable<Corral> {
    return this.http.put<Corral>(`${this.apiUrl}/corral/${corral.id}`, corral);
  }

  deleteCorral(corralId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/corral/${corralId}`);
  }

  getPesebrerasByCorral(corralId: string): Observable<Pesebrera[]> {
    return this.http.get<Pesebrera[]>(`${this.apiUrl}/manger/by-corral/${corralId}`);
  }  

  postPesebrera(pesebrera: Omit<Pesebrera, 'id'>): Observable<Pesebrera> {
    return this.http.post<Pesebrera>(`${this.apiUrl}/manger`, pesebrera);
  }

  putPesebrera(pesebrera: Pesebrera): Observable<Pesebrera> {
    return this.http.put<Pesebrera>(`${this.apiUrl}/manger/${pesebrera.id}`, pesebrera);
  }

  deletePesebrera(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/manger/${id}`);
  }

  getCensos(): Observable<Censo[]> {
    return this.http.get<Censo[]>(`${this.apiUrl}/census`);
  }

  postCenso(censo: Omit<Censo, 'id'>): Observable<Censo> {
    return this.http.post<Censo>(`${this.apiUrl}/census`, censo);
  }
  

  deleteCenso(censo: Censo): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/census/${censo.id}`);
  }

  closeCenso(censo: Censo): Observable<Censo> {
    return this.http.put<Censo>(`${this.apiUrl}/census/${censo.id}`, {
      state_id: 2,
    });
  }
  
  putCenso(censo: Censo): Observable<Censo> {
    return this.http.put<Censo>(`${this.apiUrl}/census/${censo.id}`, censo);
  }

  getCensoEnProgreso(): Observable<Censo> {
    return this.http.get<Censo>(`${this.apiUrl}/census/in/progress`);
  }
  
}
