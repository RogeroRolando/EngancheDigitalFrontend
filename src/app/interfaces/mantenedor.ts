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

export interface Pesebrera {
  id: string;
  corral_id: string;
  pesebrera_id: number;
  description: string;
  latitude: number;
  longitude: number;
}

export interface Censo {
  id: string;
  date: string;
  state_id: number;
  comment: string;
}

export interface Coordenadas {
  latitude: number;
  longitude: number;
}
