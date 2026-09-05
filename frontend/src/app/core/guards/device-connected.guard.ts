import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FlowioApiService } from '../../services/flowio-api.service';
import { catchError, map, of } from 'rxjs';

export const deviceConnectedGuard: CanActivateFn = () => {
  const api = inject(FlowioApiService);
  const router = inject(Router);

  return api.healthCheck().pipe(
    map(() => true),
    catchError(() => {
      return of(true);
    })
  );
};
