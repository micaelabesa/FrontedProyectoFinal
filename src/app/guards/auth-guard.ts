import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  
  if (!token) {
    //###TODO:alert y redireccion al login

    router.navigate(['/login']);
    return false;
  }
  return true;
  
};
