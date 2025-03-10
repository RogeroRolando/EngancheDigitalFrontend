export interface Corral {
  id: string;
  corral_id: number;
  address: string;
  mangers: number;
  rooms: number;
  offices: number;
  propietary_rut: number;
  sector_id: string;
}

export interface CorralData extends Corral {
  otro: string;
}

export interface Pesebrera {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface CensoFSC {
  censo_id: number;
  rut_fsc: string;
  corral_id: number;
  pesebrera_id: number;
  preparador_rut: string;
}

export interface Zona {
  id: string;
  name: string;
  description: string;
}

export interface Sector {
  id: string;
  sector_id: number;
  zone_id: string; 
  description: string;
}

export interface CensusCorral {
  cant_apero: number;
  cant_extintor: number;
  cant_forraje: number;
  cant_fsc: number;
  cant_fsc_nn: number;
  cant_silla: number;
  censo_id: string;
  corral_id: string;
  irreg?: string;
  obs?: string;
  preparador_rut?: number;
}
