import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { enableProdMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '@lottiefiles/dotlottie-wc';
import { inject } from '@vercel/analytics';

if (environment.production) {
  enableProdMode();
}else {
  console.log('Development mode: Production optimizations are disabled.');
}

// Inject Vercel Web Analytics
inject({
  mode: environment.production ? 'production' : 'development',
  framework: 'angular'
});

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
