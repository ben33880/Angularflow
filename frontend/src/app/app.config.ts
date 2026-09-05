import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { apiPrefixInterceptor } from './core/interceptors/api-prefix.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([apiPrefixInterceptor]))
  ]
};
