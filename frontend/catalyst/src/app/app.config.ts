import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '@environments/environment';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
//import { provideServiceWorker } from '@angular/service-worker';
// This file is used to configure the application with the necessary providers and routes.
// It sets up the router with the defined routes for the application.
export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
    provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),
    // provideAppInitializer(() => {
    //     const initializerFn = ((dataManager: DataManagerService) => () => dataManager.checkLoggedInStatus())(inject(DataManagerService));
    //     return initializerFn();
    //   }),
    provideServiceWorker('ngsw-worker.js', {
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
