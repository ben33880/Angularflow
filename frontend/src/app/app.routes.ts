import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { deviceConnectedGuard } from './core/guards/device-connected.guard';

export const appRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [deviceConnectedGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./features/devices/devices.component').then(m => m.DevicesComponent)
      },
      {
        path: 'system',
        loadComponent: () =>
          import('./features/system/system.component').then(m => m.SystemComponent)
      },
      {
        path: 'config',
        loadComponent: () =>
          import('./features/config/config.component').then(m => m.ConfigComponent)
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./features/logs/logs.component').then(m => m.LogsComponent)
      },
      {
        path: 'alarms',
        loadComponent: () =>
          import('./features/alarms/alarms.component').then(m => m.AlarmsComponent)
      }
    ]
  }
];
