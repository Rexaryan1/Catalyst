import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { Router } from '@angular/router';
import { DataManagerService } from '../data-manager/data-manager.service';
import { catchError, map, Observable, of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(
        private oauthService: OAuthService,
        private router: Router,
        private dataManager: DataManagerService
    ) {
        this.configure();
    }

    private configure(): void {
        this.oauthService.configure(authConfig);

        // Loads Google's endpoints and handles
        // the callback automatically if returning from Google
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
            if (this.isLoggedIn) {
                this.router.navigate(['/home']); // redirect after login
            }
        });
    }

    // Redirect user to Google login page
    // login(): void {
    //     this.oauthService.initCodeFlow();
    // }
    login(): void {
        window.location.href = 'https://api.catalystedutech.com/api/user/google/auth'; // Redirect to backend for Google OAuth
    }

    // Log user out and redirect to login
    logout(): void {
        this.oauthService.logOut();
        this.dataManager.logout();
        this.router.navigate(['/login']);
    }

    // Check if user has a valid token
    get isLoggedIn(): Observable<boolean> {
        if (this.oauthService.hasValidAccessToken() || this.dataManager.isUserLoggedIn()) {
            return of(true);
        }
        return this.dataManager.get('api/user/dashboard', { withCredentials: true }).pipe(
            map((response: any) => {
                return true; // User is logged in, let them through
            }),
            catchError(() => {
                this.dataManager.logout();
                return of(false);
            })
        );
    }

    // Get user profile info (name, email, picture)
    get userProfile(): any {
        return this.oauthService.getIdentityClaims();
    }

    // Get the raw access token (send this to your backend)
    get accessToken(): string {
        return this.oauthService.getAccessToken();
    }
}