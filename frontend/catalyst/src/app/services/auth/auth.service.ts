import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { Router } from '@angular/router';
import { DataManagerService } from '../data-manager/data-manager.service';
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
        this.router.navigate(['/login']);
    }

    // Check if user has a valid token
    get isLoggedIn(): boolean {
        if (this.oauthService.hasValidAccessToken() || this.dataManager.isUserLoggedIn()) {
            return true;
        }
        return false;
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