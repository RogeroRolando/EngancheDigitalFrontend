export interface Iat {
  iat: Date;
}

export interface Payload {
  id: string;
  first_name: string;
  last_name: string;
  rut: string;
  email: string;
  staff: boolean;
  iat: number;
  exp: number;
}

export interface Menu {
  id: string;
  name: string;
  displayName: string;
}

export interface Module {
  name: string;
  menus: Menu[];
}

export interface Confirmation {
  title: string;
  message: string;
  accept?: string;
  reject: string;
}
