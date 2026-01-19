import { ApplicationConfig, inject, provideAppInitializer, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '@environments/environment';
//import { provideServiceWorker } from '@angular/service-worker';
// This file is used to configure the application with the necessary providers and routes.
// It sets up the router with the defined routes for the application.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),
    provideAppInitializer(() => {
        const initializerFn = ((dataManager: DataManagerService) => () => dataManager.checkLoggedInStatus())(inject(DataManagerService));
        return initializerFn();
      }), provideServiceWorker('ngsw-worker.js', {
            enabled: environment.production,
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};
