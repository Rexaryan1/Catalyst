import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn) {
        return true;                      // ✅ user is logged in, let them through
    }

    router.navigate(['/register']);        // ❌ not logged in, send to login
    return false;
};