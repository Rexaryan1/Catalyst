import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);  // Inject Router for redirection
  if (localStorage.getItem('jwt')) {  // Check for your JWT key (adjust if it's different, e.g., 'token')
    return true;  // Token exists, allow access
  } else {
    router.navigate(['/login']);  // Redirect to login if no token
    return false;
  }
};
