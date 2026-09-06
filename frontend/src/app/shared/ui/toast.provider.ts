import { Provider } from '@angular/core';
import { ToastService } from './toast.service';

export const toastServiceProvider: Provider = {
  provide: ToastService,
  useFactory: () => new ToastService(),
  deps: []
};
