import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin + '/auth/callback',
    clientId: 'YOUR_CLIENT_ID',
    scope: 'openid profile email',
    responseType: 'code',
};