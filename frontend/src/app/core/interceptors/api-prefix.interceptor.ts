import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const apiRoot = environment.flowioBaseUrl;
  const modified = req.clone({ url: req.url.startsWith('/api') ? `${apiRoot}${req.url}` : req.url });
  return next(modified).pipe(
    catchError((err) => {
      const message = err?.error?.message ?? err?.message ?? 'Erreur réseau';
      return throwError(() => new Error(message));
    })
  );
};
