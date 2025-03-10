import { CanActivateFn } from '@angular/router';

export const menuGuard: CanActivateFn = (route, state) => {
  return true;
};
