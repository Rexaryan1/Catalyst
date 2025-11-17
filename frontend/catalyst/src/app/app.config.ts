import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DataManagerService } from '@services/data-manager/data-manager.service';
// This file is used to configure the application with the necessary providers and routes.
// It sets up the router with the defined routes for the application.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),
    provideAppInitializer(() => {
        const initializerFn = ((dataManager: DataManagerService) => () => dataManager.checkLoggedInStatus())(inject(DataManagerService));
        return initializerFn();
      })
  ]
};
